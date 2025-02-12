import api from './api';

class S3Service {
  /**
   * Process content with embedded images
   * @param {string} content - The content with embedded images
   * @returns {Object} - Object containing processed content and extracted images
   */
  processContentWithImages(content) {
    if (!content) return { processedContent: content, images: [] };
    
    const images = [];
    const imgRegex = /<img[^>]+src="(data:image\/[^"]+)"[^>]*>/g;
    
    // Replace base64 images with temporary IDs and collect the images
    let processedContent = content;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const fullImgTag = match[0];
      const base64Src = match[1];
      
      if (this.isBase64Image(base64Src)) {
        // Generate a unique ID for this image
        const tempId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Replace the src with the temp ID
        const newImgTag = fullImgTag.replace(base64Src, `temp:${tempId}`);
        processedContent = processedContent.replace(fullImgTag, newImgTag);
        
        // Add the image to our collection
        const file = this.base64ToFile(base64Src, `${tempId}.jpg`);
        images.push({
          id: tempId,
          file: file
        });
      }
    }
    
    return {
      processedContent,
      images
    };
  }

  /**
   * Upload multiple images with their IDs
   * @param {Array} images - Array of {id, file} objects
   * @param {string} folder - Optional folder path in S3
   * @returns {Promise<Array>} - Array of uploaded file metadata
   */
  async uploadMultipleImages(images, folder = 'notebooks') {
    const formData = new FormData();
    
    // Append each image with its ID
    images.forEach(image => {
      formData.append('images', image.file);
      formData.append('imageIds', image.id);
    });
    
    formData.append('folder', folder);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await api.post('/upload/multiple-images', formData, config);
    return response.data;
  }

  /**
   * Upload a single image to S3
   * @param {File} file - The file to upload
   * @param {string} folder - Optional folder path in S3
   * @returns {Promise<Object>} - The uploaded file metadata
   */
  async uploadImage(file, folder = 'notebooks') {
    // Create form data to send the file
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    // Set the content type to multipart/form-data
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await api.post('/upload/image', formData, config);
    return response.data;
  }

  /**
   * Convert a base64 image to a file object
   * @param {string} base64String - The base64 string
   * @param {string} fileName - Name for the file
   * @returns {File} - The file object
   */
  base64ToFile(base64String, fileName) {
    // Extract the MIME type from the base64 string
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string format');
    }
    
    const type = matches[1];
    const base64Data = matches[2];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type });
    return new File([blob], fileName, { type });
  }

  /**
   * Detect if a string is a base64 image
   * @param {string} str - String to check
   * @returns {boolean} - True if the string is a base64 image
   */
  isBase64Image(str) {
    if (!str || typeof str !== 'string') return false;
    const regex = /^data:image\/[a-z]+;base64,/;
    return regex.test(str);
  }
}

export default new S3Service();
