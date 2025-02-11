const User = require('../models/userModel');

// Update user's Gemini API key
const updateGeminiApiKey = async (req, res) => {
  try {
    const { geminiApiKey } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { geminiApiKey },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      success: true,
      message: 'API key updated successfully',
      geminiApiKey: user.geminiApiKey 
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's Gemini API key
const getGeminiApiKey = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      success: true,
      geminiApiKey: user.geminiApiKey 
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  updateGeminiApiKey,
  getGeminiApiKey
};





