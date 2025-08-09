const { YoutubeTranscript } = require('youtube-transcript');
const { getGeminiModel } = require('../utils/geminiConfig');
const { getAsync, setAsync } = require('./redisService');

/**
 * Transcripts are fetched here in Node and handed to Gemini whole.
 *
 * The earlier design ran a separate Flask service that embedded the transcript
 * with sentence-transformers and stored the vectors in Qdrant, then retrieved
 * the five best-matching chunks per question. That made sense with small
 * context windows. Gemini can read a whole lecture transcript in one go, so the
 * embedding model, the vector store and the extra service are no longer needed
 * - and the answers are better for seeing the full picture rather than five
 * isolated fragments.
 */

const TRANSCRIPT_TTL_SECONDS = 24 * 60 * 60;

// How much transcript to hand the model at once. Well within Gemini's context,
// and small enough to keep responses quick. Longer videos fall back to picking
// the most relevant chunks.
const CONTEXT_CHAR_LIMIT = 40000;

// Segments arrive as very short fragments. Grouping them keeps each piece of
// context readable and gives the timestamps something meaningful to point at.
const CHUNK_CHAR_TARGET = 600;

const cacheKey = (videoId) => `transcript:${videoId}`;

const formatTimestamp = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Group raw segments into readable chunks. offset and duration arrive in
 * milliseconds; everything downstream works in seconds.
 */
const buildChunks = (segments) => {
  const chunks = [];
  let current = null;

  for (const segment of segments) {
    const text = (segment.text || '').replace(/\s+/g, ' ').trim();
    if (!text) continue;

    const start = (segment.offset || 0) / 1000;
    const duration = (segment.duration || 0) / 1000;

    if (!current) {
      current = { text, start, duration };
    } else if (current.text.length + text.length + 1 <= CHUNK_CHAR_TARGET) {
      current.text += ' ' + text;
      current.duration = start + duration - current.start;
    } else {
      chunks.push(current);
      current = { text, start, duration };
    }
  }

  if (current) chunks.push(current);
  return chunks;
};

/**
 * Ask for English first. Left to itself the library returns whichever caption
 * track YouTube lists first, which on a multi-language video can be a
 * translation - a English course came back in Arabic. If there is no English
 * track, take whatever the video does have.
 */
const fetchSegments = async (videoId) => {
  try {
    const english = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    if (english && english.length) return english;
  } catch (error) {
    // No English track; fall through to the default below.
  }
  return YoutubeTranscript.fetchTranscript(videoId);
};

const fetchTranscript = async (videoId) => {
  const cached = await getAsync(cacheKey(videoId));
  if (cached) return cached;

  const segments = await fetchSegments(videoId);
  if (!segments || !segments.length) {
    throw new Error('No transcript available for this video');
  }

  const chunks = buildChunks(segments);
  await setAsync(cacheKey(videoId), chunks, TRANSCRIPT_TTL_SECONDS);
  return chunks;
};

/**
 * Called when the chat panel opens. Fetching is fast enough to do inline, so
 * there is no background job to poll - the transcript is either ready when
 * this returns or it is genuinely unavailable.
 */
const initiateTranscriptProcessing = async (videoId) => {
  try {
    const chunks = await fetchTranscript(videoId);
    return {
      status: 'exists',
      message: `Transcript ready (${chunks.length} sections)`,
      chunks: chunks.length,
    };
  } catch (error) {
    console.error(`Transcript unavailable for ${videoId}:`, error.message);
    return {
      status: 'unavailable',
      message: 'This video has no transcript available, so questions about it cannot be answered.',
    };
  }
};

const getTranscriptStatus = async (videoId) => {
  try {
    const cached = await getAsync(cacheKey(videoId));
    if (cached) {
      return { status: 'exists', message: `Transcript ready (${cached.length} sections)` };
    }
    return await initiateTranscriptProcessing(videoId);
  } catch (error) {
    console.error(`Error checking transcript status for ${videoId}:`, error.message);
    return { status: 'unavailable', message: 'Could not load the transcript for this video.' };
  }
};

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'with', 'this', 'that',
  'what', 'when', 'how', 'why', 'does', 'did', 'was', 'were', 'can', 'about',
  'from', 'they', 'have', 'has', 'its', 'his', 'her', 'their', 'them',
]);

const scoreChunk = (chunk, terms) => {
  const haystack = chunk.text.toLowerCase();
  return terms.reduce((score, term) => (haystack.includes(term) ? score + 1 : score), 0);
};

/**
 * Returns transcript context for a question. Kept under the old name and shape
 * so the chat controller did not need changing: each result carries a `payload`
 * with text and a start time.
 *
 * Short videos return in full - the model reading everything beats any
 * retrieval heuristic. Only when a transcript is too long to send whole does
 * this fall back to picking the chunks that mention the question's terms.
 */
const semanticSearch = async (query, videoId, limit = 5) => {
  try {
    const chunks = await fetchTranscript(videoId);

    const toResult = (chunk) => ({
      payload: {
        text: chunk.text,
        start: chunk.start,
        duration: chunk.duration,
        timestamp: formatTimestamp(chunk.start),
      },
    });

    const totalChars = chunks.reduce((n, c) => n + c.text.length, 0);
    if (totalChars <= CONTEXT_CHAR_LIMIT) {
      return chunks.map(toResult);
    }

    const terms = (query || '')
      .toLowerCase()
      .split(/\W+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

    // No usable search terms: fall back to an even sample across the video so
    // the model still sees the shape of it rather than only the opening.
    if (!terms.length) {
      const step = Math.ceil(chunks.length / Math.max(limit, 1));
      return chunks.filter((_, i) => i % step === 0).map(toResult);
    }

    const ranked = chunks
      .map((chunk, index) => ({ chunk, index, score: scoreChunk(chunk, terms) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, Math.max(limit, 8));

    // Nothing matched: give the model a sample rather than nothing at all.
    if (!ranked.length) {
      const step = Math.ceil(chunks.length / Math.max(limit, 1));
      return chunks.filter((_, i) => i % step === 0).map(toResult);
    }

    // Back into chronological order so the context reads like the video.
    return ranked.sort((a, b) => a.index - b.index).map((entry) => toResult(entry.chunk));
  } catch (error) {
    console.error('Error retrieving transcript context:', error.message);
    return [];
  }
};

/**
 * The transcript as chunks, for callers that want the whole thing rather than
 * the pieces relevant to a question.
 */
const getTranscriptChunks = async (videoId) => {
  const chunks = await fetchTranscript(videoId);
  return chunks.map((chunk) => ({
    text: chunk.text,
    start: chunk.start,
    duration: chunk.duration,
    timestamp: formatTimestamp(chunk.start),
  }));
};

/** The transcript as one plain string. */
const getTranscriptText = async (videoId) => {
  const chunks = await fetchTranscript(videoId);
  return chunks.map((chunk) => chunk.text).join(' ');
};

const manageChatSession = async (userId, videoId, updateData = null) => {
  const sessionKey = `chat:${userId}:${videoId}`;
  const SESSION_TTL = 3600;

  try {
    if (updateData) {
      const existingSession = (await getAsync(sessionKey)) || {
        userId,
        videoId,
        messages: [],
        createdAt: Date.now(),
      };
      existingSession.messages.push(...updateData.messages);
      existingSession.lastActive = Date.now();
      await setAsync(sessionKey, existingSession, SESSION_TTL);
      return existingSession;
    }

    const cachedSession = await getAsync(sessionKey);
    if (cachedSession) {
      cachedSession.lastActive = Date.now();
      await setAsync(sessionKey, cachedSession, SESSION_TTL);
      return cachedSession;
    }

    const newSession = {
      userId,
      videoId,
      messages: [],
      createdAt: Date.now(),
      lastActive: Date.now(),
    };

    await setAsync(sessionKey, newSession, SESSION_TTL);
    return newSession;
  } catch (error) {
    console.error('Error managing chat session:', error);
    throw error;
  }
};

const managePresentationChatSession = async (userId, presentationId, updateData = null) => {
  const sessionKey = `presentation_chat:${userId}:${presentationId}`;
  const SESSION_TTL = 3600;

  try {
    if (updateData) {
      const existingSession = (await getAsync(sessionKey)) || {
        userId,
        presentationId,
        messages: [],
        createdAt: Date.now(),
      };

      existingSession.messages.push(...updateData.messages);
      existingSession.lastActive = Date.now();
      await setAsync(sessionKey, existingSession, SESSION_TTL);
      return existingSession;
    }

    const cachedSession = await getAsync(sessionKey);

    if (cachedSession) {
      cachedSession.lastActive = Date.now();
      await setAsync(sessionKey, cachedSession, SESSION_TTL);
      return cachedSession;
    }

    const newSession = {
      userId,
      presentationId,
      messages: [],
      createdAt: Date.now(),
      lastActive: Date.now(),
    };

    await setAsync(sessionKey, newSession, SESSION_TTL);
    return newSession;
  } catch (error) {
    console.error('Error managing presentation chat session:', error);
    throw error;
  }
};

module.exports = {
  semanticSearch,
  getTranscriptChunks,
  getTranscriptText,
  manageChatSession,
  managePresentationChatSession,
  getGeminiModel,
  initiateTranscriptProcessing,
  getTranscriptStatus,
  formatTimestamp,
};
