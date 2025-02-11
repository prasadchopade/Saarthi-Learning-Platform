const express = require('express');
const router = express.Router();
const {
  uploadSingleImage,
  handleSingleImageUpload,
  uploadMultipleImages,
  handleMultipleImageUpload
} = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route for single image upload
router.post('/image', authMiddleware, (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    handleSingleImageUpload(req, res);
  });
});

// Route for multiple image uploads
router.post('/multiple-images', authMiddleware, (req, res) => {
  uploadMultipleImages(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    handleMultipleImageUpload(req, res);
  });
});

module.exports = router;
