const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// API key management routes
router.post('/api-key', authMiddleware, userController.updateGeminiApiKey);
router.get('/api-key', authMiddleware, userController.getGeminiApiKey);

module.exports = router;
