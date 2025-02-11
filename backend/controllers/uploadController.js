const multer = require('multer');
const path = require('path');
const fs = require('fs');
const s3Service = require('../services/s3Service');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware for single image upload
const uploadSingleImage = upload.single('image');

// Middleware for multiple image uploads
const uploadMultipleImages = upload.array('images', 20); // Max 20 images

/**
 * Upload a single image to S3
 */
const handleSingleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const folder = req.body.folder || 'uploads';
    const fileName = req.file.originalname || 'image.jpg';
    const key = s3Service.generateUniqueKey(folder, fileName);
    
    // Upload to S3
    const result = await s3Service.uploadFile(
      req.file.buffer,
      req.file.mimetype,
      key
    );

    // Generate a presigned URL that expires in 1 hour
    const presignedUrl = s3Service.getPresignedUrl(key);

    res.status(200).json({
      success: true,
      key: result.key,
      url: presignedUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

/**
 * Upload multiple images to S3
 */
const handleMultipleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const folder = req.body.folder || 'uploads';
    const imageIds = req.body.imageIds ? req.body.imageIds.split(',') : [];
    
    // Process each file
    const uploadPromises = req.files.map(async (file, index) => {
      const id = imageIds[index] || `img_${Date.now()}_${index}`;
      const fileName = file.originalname || `${id}.jpg`;
      const key = s3Service.generateUniqueKey(folder, fileName);
      
      // Upload to S3
      const result = await s3Service.uploadFile(
        file.buffer,
        file.mimetype,
        key
      );

      // Generate a presigned URL that expires in 1 hour
      const presignedUrl = s3Service.getPresignedUrl(key);

      return {
        id,
        key: result.key,
        url: presignedUrl
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

module.exports = {
  uploadSingleImage,
  handleSingleImageUpload,
  uploadMultipleImages,
  handleMultipleImageUpload
};
