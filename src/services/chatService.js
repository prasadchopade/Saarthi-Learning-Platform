import api from './api';

class ChatService {
  /**
   * Initialize chat context for a video
   * @param {string} videoId - ID of the video to initialize context for
   * @returns {Promise<Object>} Response data
   */
  async initializeContext(videoId) {
    try {
      const response = await api.post(`/chat/${videoId}/initialize`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initialize chat context for a presentation
   * @param {string} presentationId - ID of the presentation to initialize context for
   * @returns {Promise<Object>} Response data
   */
  async initializePresentationContext(presentationId) {
    try {
      const response = await api.post(`/chat/presentation/${presentationId}/initialize`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get chat history for a video
   * @param {string} videoId - ID of the video to get history for
   * @returns {Promise<Array>} Chat history
   */
  async getChatHistory(videoId) {
    try {
      const response = await api.get(`/chat/${videoId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get chat history for a presentation
   * @param {string} presentationId - ID of the presentation to get history for
   * @returns {Promise<Array>} Chat history
   */
  async getPresentationChatHistory(presentationId) {
    try {
      const response = await api.get(`/chat/presentation/${presentationId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a message to the chat for a video
   * @param {string} videoId - ID of the video the chat is for
   * @param {string} message - Message content
   * @returns {Promise<Object>} Response with AI message and context
   */
  async sendMessage(videoId, message) {
    try {
      const response = await api.post(`/chat/${videoId}/message`, { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a message to the chat for a presentation
   * @param {string} presentationId - ID of the presentation the chat is for
   * @param {string} message - Message content
   * @returns {Promise<Object>} Response with AI message and context
   */
  async sendPresentationMessage(presentationId, message) {
    try {
      const response = await api.post(`/chat/presentation/${presentationId}/message`, { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatService();
