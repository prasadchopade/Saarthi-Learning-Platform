const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/disciplines', authMiddleware, youtubeController.getDisciplines);
router.get('/search',authMiddleware, youtubeController.searchVideos);
router.get('/topic/:discipline/:topic',authMiddleware, youtubeController.getTopicVideos);

// Admin route for initializing topics (protected)
router.post('/init', authMiddleware, youtubeController.initializeTopics);

module.exports = router;