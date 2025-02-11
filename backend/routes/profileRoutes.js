const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const interestController = require('../controllers/interestController');

router.post('/interests', authMiddleware, interestController.addInterest);
router.delete('/interests/:discipline/:topic', authMiddleware, interestController.removeInterest);
router.get('/interests', authMiddleware, interestController.getInterests);
router.post('/add-to-watch-history', authMiddleware, interestController.addToWatchHistory);
router.get('/watch-history', authMiddleware, interestController.getWatchHistory);

module.exports = router;