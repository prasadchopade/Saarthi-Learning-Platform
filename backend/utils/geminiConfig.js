const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/userModel');

// An alias rather than a pinned version: the previously hardcoded
// gemini-2.0-flash was retired and every AI request started returning 404.
//
// The *lite* alias specifically, because the free tier meters per model and
// the full Flash model allows only 20 requests per day - enough to exhaust in
// a few minutes of ordinary use. The lite tier is a little less capable but
// has a usable free allowance, which matters more here. Set GEMINI_MODEL to
// override (e.g. gemini-flash-latest on a paid key).
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

// Gemini intermittently returns 503 ("model is overloaded") and 429 on the
// free tier. Those are transient, but without a retry a single one surfaces
// to the user as a failed generation. Retries generateContent only - chat
// sessions from startChat are stateful and are left alone.
const RETRYABLE_STATUS = /\[(429|500|502|503|504)\s/;

const withRetry = (model) => {
  const generate = model.generateContent.bind(model);

  model.generateContent = async (...args) => {
    let lastError;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await generate(...args);
      } catch (error) {
        lastError = error;
        if (!RETRYABLE_STATUS.test(String(error && error.message))) throw error;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        }
      }
    }

    throw lastError;
  };

  return model;
};

// Function to get Gemini model instance with user's API key
const getGeminiModel = async (userId) => {
  try {
    if (!userId || userId === 'system') {
      const systemApiKey = process.env.GEMINI_API_KEY;
      if (!systemApiKey) {
        throw new Error('No system Gemini API key configured');
      }
      const genAI = new GoogleGenerativeAI(systemApiKey);
      return withRetry(genAI.getGenerativeModel({ model: MODEL_NAME }));
    }

    const user = await User.findById(userId);
    if (!user || !user.geminiApiKey) {
      throw new Error('No Gemini API key found for user');
    }

    const genAI = new GoogleGenerativeAI(user.geminiApiKey);
    return withRetry(genAI.getGenerativeModel({ model: MODEL_NAME }));
  } catch (error) {
    console.error('Error getting Gemini model:', error);
    throw error;
  }
};

module.exports = { getGeminiModel }; 