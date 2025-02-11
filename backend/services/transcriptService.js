const { QdrantClient } = require('@qdrant/js-client-rest');
const { getGeminiModel } = require('../utils/geminiConfig');
const { getAsync, setAsync } = require('./redisService');
const axios = require('axios');

// Initialize Qdrant client
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY });
const COLLECTION_NAME = 'video_transcripts';


const initiateTranscriptProcessing = async (videoId) => {
  try {
    const response = await axios.post(`${process.env.PYTHON_SERVICE_URL}/api/videos/${videoId}/process`);
    return response.data;
  } catch (error) {
    console.error('Error initiating transcript processing:', error);
    throw error;
  }
};

const getTranscriptStatus = async (videoId) => {
  try {
    const response = await axios.get(`${process.env.PYTHON_SERVICE_URL}/api/videos/${videoId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting transcript status:', error);
    throw error;
  }
};

const formatTimestamp = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Function to perform semantic search
const semanticSearch = async (query, videoId, limit = 5) => {
  try {
    const status = await getTranscriptStatus(videoId);
    if (status.status !== 'exists') {
      console.warn(`Video transcript not ready: ${status.status}`);
      return [];
    }
    const response = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/api/videos/${videoId}/search`,
      {
        query,
        limit
      }
    );
    if (response.data.status === 'error') {
      console.error('Search error:', response.data.error);
      return [];
    }
    const results = response.data.results || [];
    return results.map(result => ({
      ...result,
      payload: result.payload || {
        text: result.text || "",
        start: result.start || 0,
        duration: result.duration || 0,
        timestamp: result.timestamp || "0:00"
      }
    }));
  } catch (error) {
    console.error('Error performing semantic search:', error);
    return [];
  }
};

const manageChatSession = async (userId, videoId, updateData = null) => {
  const sessionKey = `chat:${userId}:${videoId}`;
  const SESSION_TTL = 3600;
  
  try {
    if (updateData) {
      const existingSession = await getAsync(sessionKey) || { 
        userId, 
        videoId, 
        messages: [], 
        createdAt: Date.now() 
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
      lastActive: Date.now()
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
      const existingSession = await getAsync(sessionKey) || { 
        userId, 
        presentationId, 
        messages: [], 
        createdAt: Date.now() 
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
      lastActive: Date.now()
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
  manageChatSession,
  managePresentationChatSession,
  getGeminiModel,
  initiateTranscriptProcessing,
  getTranscriptStatus,
  formatTimestamp
}; 