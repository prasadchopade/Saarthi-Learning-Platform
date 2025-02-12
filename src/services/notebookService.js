import api from './api';
import s3Service from './s3Service';

class NotebookService {
  /**
   * Get all notebooks for a user
   * @returns {Promise<Array>} List of notebooks
   */
  async getNotebooks() {
    const response = await api.get('/notebook/getNotebooks');
    return response.data;
  }

  /**
   * Create a new notebook
   * @param {Object} notebookData - Notebook data
   * @param {string} notebookData.title - Title of the notebook
   * @returns {Promise<Object>} Created notebook
   */
  async createNotebook(notebookData) {
    const response = await api.post('/notebook/createNotebook', notebookData);
    return response.data;
  }

  /**
   * Delete a notebook
   * @param {string} notebookId - ID of the notebook to delete
   * @returns {Promise<Object>} Response data
   */
  async deleteNotebook(notebookId) {
    const response = await api.delete(`/notebook/deleteNotebook/${notebookId}`);
    return response.data;
  }

  /**
   * Save notebook content with embedded images
   * @param {string} notebookId - ID of the notebook
   * @param {string} content - Content to save (may contain base64 images)
   * @returns {Promise<Object>} Updated notebook
   */
  async saveNotebookContent(notebookId, content) {
    // Process content to extract and replace base64 images with temp IDs
    const { processedContent, images } = s3Service.processContentWithImages(content);
    
    // If there are no images, just save the content directly
    if (images.length === 0) {
      const response = await api.put(`/notebook/saveNotebook/${notebookId}`, { content });
      return response.data;
    }
    
    // If there are images, upload them first
    const uploadedImages = await s3Service.uploadMultipleImages(images, `notebooks/${notebookId}`);
    
    // Then save the processed content with the image references
    const response = await api.put(`/notebook/saveNotebook/${notebookId}`, { 
      content: processedContent,
      images: uploadedImages
    });
    
    return response.data;
  }

  /**
   * Get notebook content
   * @param {string} notebookId - ID of the notebook
   * @returns {Promise<string>} Notebook content with resolved image URLs
   */
  async getNotebookContent(notebookId) {
    const response = await api.get(`/notebook/getNotebookContent/${notebookId}`);
    return response.data;
  }
}

export default new NotebookService();
