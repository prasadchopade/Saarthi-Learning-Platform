const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/userModel');

// Function to get Gemini model instance with user's API key
const getGeminiModel = async (userId) => {
  try {
    if (!userId || userId === 'system') {
      const systemApiKey = process.env.GEMINI_API_KEY;
      if (!systemApiKey) {
        throw new Error('No system Gemini API key configured');
      }
      const genAI = new GoogleGenerativeAI(systemApiKey);
      return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    const user = await User.findById(userId);
    if (!user || !user.geminiApiKey) {
      throw new Error('No Gemini API key found for user');
    }

    const genAI = new GoogleGenerativeAI(user.geminiApiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } catch (error) {
    console.error('Error getting Gemini model:', error);
    throw error;
  }
};

module.exports = { getGeminiModel }; 