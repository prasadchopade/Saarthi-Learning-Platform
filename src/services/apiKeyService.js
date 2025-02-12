import api from './api';

export const apiKeyService = {
  /**
   * Get the user's Gemini API key
   * @returns {Promise<string>} The API key if successful
   */
  getApiKey: async () => {
    try {
      const response = await api.get('/user/api-key');
      return response.data.success ? response.data.geminiApiKey : '';
    } catch (error) {
      console.error('Failed to fetch API key:', error);
      throw error;
    }
  },

  /**
   * Update the user's Gemini API key
   * @param {string} apiKey - The new Gemini API key
   * @returns {Promise<Object>} Response data
   */
  updateApiKey: async (apiKey) => {
    try {
      const response = await api.post('/user/api-key', { geminiApiKey: apiKey });
      return response.data;
    } catch (error) {
      console.error('Failed to update API key:', error);
      throw error;
    }
  }
};
