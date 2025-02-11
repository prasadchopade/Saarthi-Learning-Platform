const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Video chat routes
// Initialize video context
router.post('/:videoId/initialize', authMiddleware, chatController.initializeVideoContext);

// Get video processing status
router.get('/:videoId/status', authMiddleware, chatController.getVideoStatus);

// Get video chat history
router.get('/:videoId/history', authMiddleware, chatController.getChatHistory);

// Send a message and get response for video
router.post('/:videoId/message', authMiddleware, chatController.sendMessage);

// Presentation chat routes
// Initialize presentation context
router.post('/presentation/:presentationId/initialize', authMiddleware, chatController.initializePresentationContext);

// Get presentation chat history
router.get('/presentation/:presentationId/history', authMiddleware, chatController.getPresentationChatHistory);

// Send a message and get response for presentation
router.post('/presentation/:presentationId/message', authMiddleware, chatController.sendPresentationMessage);

module.exports = router; 