const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
  convertTextToSpeech,
  translateText 
} = require('../controllers/ttsController');

// Routes for Text-to-Speech functionality
router.post('/convert', authMiddleware, convertTextToSpeech);
router.post('/translate', authMiddleware, translateText);

module.exports = router;
