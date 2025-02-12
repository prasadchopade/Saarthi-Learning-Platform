import api from './api';

/**
 * Service for handling presentation-related API calls
 */
const presentationService = {
  /**
   * Get a presentation by ID
   * @param {string} id - Presentation ID
   * @returns {Promise<Object>} - Presentation data
   */
  getPresentation: async (id) => {
    try {
      const response = await api.get(`/presentations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching presentation:', error);
      throw error;
    }
  },

  /**
   * Create a new presentation
   * @param {Object} data - Presentation data including type, content, mode, and pageRange for PDF
   * @returns {Promise<Object>} - Created presentation data with ID
   */
  createPresentation: async (data) => {
    try {
      // Format data for API request
      const formData = new FormData();
      
      // Add basic fields
      formData.append('type', data.type);
      formData.append('content', data.content);
      formData.append('mode', data.mode);
      
      // Add page range if PDF
      if (data.type === 'pdf' && data.pageRange) {
        formData.append('startPage', data.pageRange.start);
        formData.append('endPage', data.pageRange.end);
      }
      
      // Add file if present
      if (data.file) {
        formData.append('file', data.file);
      }
      
      const response = await api.post('/presentations', data.file ? formData : data);
      return response.data;
    } catch (error) {
      console.error('Error creating presentation:', error);
      throw error;
    }
  },

  /**
   * Get all presentations for the current user
   * @returns {Promise<Array>} - Array of presentation data
   */
  getPresentations: async () => {
    try {
      const response = await api.get('/presentations');
      return response.data;
    } catch (error) {
      console.error('Error fetching presentations:', error);
      throw error;
    }
  },

  /**
   * Delete a presentation
   * @param {string} id - Presentation ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  deletePresentation: async (id) => {
    try {
      const response = await api.delete(`/presentations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting presentation:', error);
      throw error;
    }
  },

  /**
   * Update a presentation
   * @param {string} id - Presentation ID
   * @param {Object} data - Updated presentation data
   * @returns {Promise<Object>} - Updated presentation data
   */
  updatePresentation: async (id, data) => {
    try {
      const response = await api.put(`/presentations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating presentation:', error);
      throw error;
    }
  }
};

export default presentationService;
