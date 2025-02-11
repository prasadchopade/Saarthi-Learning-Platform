const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1'
});

// Create S3 service object
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} contentType - The content type of the file
 * @param {string} key - The S3 key (path) for the file
 * @returns {Promise<Object>} - The uploaded file metadata
 */
const uploadFile = async (fileBuffer, contentType, key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  };

  try {
    const result = await s3.upload(params).promise();
    return {
      key: result.Key,
      location: result.Location,
      bucket: result.Bucket
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

/**
 * Generate a presigned URL for an S3 object
 * @param {string} key - The S3 key (path) for the file
 * @param {number} expirySeconds - URL expiry time in seconds (default: 3600)
 * @returns {string} - The presigned URL
 */
const getPresignedUrl = (key, expirySeconds = 3600) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expirySeconds
  };

  try {
    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

/**
 * Generate a unique key for S3
 * @param {string} folder - The folder path
 * @param {string} fileName - The file name
 * @returns {string} - The unique S3 key
 */
const generateUniqueKey = (folder, fileName) => {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const extension = fileName.split('.').pop();
  return `${folder}/${timestamp}-${uniqueId}.${extension}`;
};

/**
 * Delete a file from S3
 * @param {string} key - The S3 key (path) for the file
 * @returns {Promise<Object>} - The deletion result
 */
const deleteFile = async (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    return await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  getPresignedUrl,
  generateUniqueKey,
  deleteFile
};
