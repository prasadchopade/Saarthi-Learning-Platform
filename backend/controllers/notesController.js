const { getGeminiModel } = require('../utils/geminiConfig');
const transcriptService = require('../services/transcriptService');

exports.enhanceNotes = async (req, res) => {
  const { text, action, prompt, context, formatAsMarkdown } = req.body;
  const userId = req.user._id;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    // Build the prompt based on action
    let aiPrompt = prompt || '';

    // Add specific formatting instructions for markdown
    if (formatAsMarkdown) {
      aiPrompt += `\n\nIMPORTANT: Format your response with proper markdown:
- Use **bold** for important terms and emphasis
- Use \`code\` for inline code
- Use triple backticks with language name for code blocks, like:
\`\`\`javascript
function example() { 
  return true; 
}
\`\`\`
- Use bullet lists with * or -
- Use # for headings (# for h1, ## for h2, etc.)
- Format tables with | and - if needed

Ensure all code is properly formatted with correct syntax highlighting hints.`;
    }

    // Add the content to process
    switch (action) {
      case 'summarize':
        aiPrompt += `\n\nText to summarize: ${text}`;
        break;
      case 'add':
        aiPrompt += `\n\nBase Text: ${text}`;
        break;
      case 'refine':
        aiPrompt += `\n\nOriginal Text: ${text}`;
        break;
      default:
        aiPrompt += `\n\nText to process: ${text}`;
    }

    // Add context if available
    if (context) {
      aiPrompt += `\n\nFor additional context, here is the broader document: ${context.substring(0, 1000)}...`;
    }

    // Get the Gemini model instance with user's API key
    const model = await getGeminiModel(userId);

    // Generate response from AI
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    // Extract the text from the response
    const responseText = result.response.text();

    res.json({
      success: true,
      result: responseText
    });

  } catch (error) {
    console.error('AI Enhancement Error:', error);
    res.status(500).json({
      message: 'Failed to process with AI',
      error: error.message
    });
  }
};

// Actual implementation of AI content generation
const generateAiContent = async (prompt) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    // Extract the text from the response
    const responseText = result.response.text();

    // Clean up any potential markdown formatting issues
    return cleanMarkdownOutput(responseText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};


const optimizeTranscript = (text) => {
  if (!text) return "";

  // 1. Basic cleaning with efficient regex
  let transcript = text
    .toLowerCase()
    .replace(/\[.*?\]/g, '')  // Remove [Music], [Applause], etc.
    .replace(/\s+/g, ' ');    // Normalize whitespace

  // 2. Remove common filler words (single regex for better performance)
  const fillerPattern = /\b(um|uh|like|you know|i mean|basically|actually|literally|so yeah|right|okay|so|well)\b/g;
  transcript = transcript.replace(fillerPattern, '');

  // 3. Simple duplicate sentence removal (using Set for performance)
  const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];
  const uniqueSentences = [...new Set(sentences)];

  // 4. Join sentences and final cleanup
  return uniqueSentences.join(' ').trim();
};

// Function to generate AI notes using Gemini with optimized chunking
const generateAiNotes = async (chunks, videoTitle, userId) => {
  try {
    const model = await getGeminiModel(userId);

    const notesPrompt = `
You are an expert educational note-taker. Create comprehensive, well-structured notes from the following lecture transcript.

INSTRUCTIONS:
1. Focus on key concepts, definitions, examples, and important points (do not give starting title or conclusion)
2. Organize content with clear headings and subheadings based on topics only
3. Use bullet points for lists and sub-points
4. Include any formulas, algorithms or code snippets in proper formatting
5. Structure the notes in a logical learning sequence
6. Create section breaks when topics change
7. Use formatting to emphasize important terms and concepts
8. Be thorough but concise - eliminate filler words and redundancy

IMPORTANT: Format your response as clean HTML that can be directly inserted into a rich text editor:
- Use <h1>, <h2>, <h3> tags for headings
- Use <p> tags for paragraphs
- Use <ul> and <li> for bullet points
- Use <ol> and <li> for numbered lists
- Use <strong> or <b> for bold text
- Use <em> or <i> for italic text
- Use <code> for inline code
- Use <pre><code> blocks for multi-line code
- Use <hr> for section breaks
- Do not include any markdown formatting

Lecture Title: ${videoTitle}

TRANSCRIPT:
`;

    const notesSegments = [];
    for (let i = 0; i < chunks.length; i++) {
      const promptForChunk = notesPrompt + chunks[i];
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptForChunk }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      });

      let notesText = result.response.text().trim();
      notesText = notesText.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
      notesSegments.push(notesText);
    }
    const combinedNotes = `<h1>${videoTitle || " "}</h1>
${notesSegments.join('<hr>')}
`;
    return combinedNotes;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate notes: ${error.message}`);
  }
};

// Intelligent chunking strategy for optimal API usage
const createOptimalChunks = (sortedChunks, maxChunks = 5) => {
  const totalText = sortedChunks.map(c => c.text || '').join(' ');
  const totalWords = totalText.split(/\s+/).length;
  const targetWordsPerChunk = Math.ceil(totalWords / maxChunks);
  const minWordsPerChunk = 2000;
  const maxWordsPerChunk = 3500;

  const optimalWordsPerChunk = Math.min(
    Math.max(targetWordsPerChunk, minWordsPerChunk),
    maxWordsPerChunk
  );
  const optimizedChunks = [];
  let currentChunk = '';
  let currentWordCount = 0;

  for (const chunk of sortedChunks) {
    const chunkText = chunk.text || '';
    const chunkWords = chunkText.split(/\s+/).length;
    if (currentWordCount > 0 && currentWordCount + chunkWords > optimalWordsPerChunk) {
      optimizedChunks.push(optimizeTranscript(currentChunk.trim()));
      currentChunk = chunkText;
      currentWordCount = chunkWords;
    } else {
      currentChunk += ' ' + chunkText;
      currentWordCount += chunkWords;
    }
  }
  if (currentChunk.trim().length > 0) {
    optimizedChunks.push(optimizeTranscript(currentChunk.trim()));
  }

  if (optimizedChunks.length > maxChunks) {
    console.warn(`Generated ${optimizedChunks.length} chunks, merging to fit ${maxChunks} limit`);
    return mergeToTargetCount(optimizedChunks, maxChunks);
  }

  return optimizedChunks;
};
const mergeToTargetCount = (chunks, targetCount) => {
  const merged = [];
  const chunksPerMerge = Math.ceil(chunks.length / targetCount);

  for (let i = 0; i < chunks.length; i += chunksPerMerge) {
    const toMerge = chunks.slice(i, i + chunksPerMerge);
    merged.push(toMerge.join('\n\n'));
  }

  return merged;
};

exports.generateSmartNotes = async (req, res) => {
  const { videoId, videoTitle } = req.body;

  if (!videoId) {
    return res.status(400).json({ message: 'Video ID is required' });
  }

  try {
    // Transcripts are fetched in-process now, so there is nothing to poll for
    // and no separate service to be running.
    let chunks;
    try {
      chunks = await transcriptService.getTranscriptChunks(videoId);
    } catch (error) {
      return res.status(404).json({
        message: 'This video has no transcript available, so notes cannot be generated from it.'
      });
    }

    if (!chunks.length) {
      return res.status(404).json({
        message: 'No transcript found for this video'
      });
    }
    const sortedChunks = chunks.sort((a, b) => a.start - b.start);

    const optimizedChunks = createOptimalChunks(sortedChunks, 5);
    const userId = req.user._id;
    const notes = await generateAiNotes(optimizedChunks, videoTitle, userId);
    res.json({
      success: true,
      notes,
      chunkCount: optimizedChunks.length,
      apiCallsMade: optimizedChunks.length
    });

  } catch (error) {
    console.error('Smart Notes Generation Error:', error);
    res.status(500).json({
      message: 'Failed to generate smart notes',
      error: error.message
    });
  }
};