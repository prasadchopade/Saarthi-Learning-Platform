import api from './api';

/**
 * Service for handling webhook-based status checking
 */
const webhookService = {
  /**
   * Check the status of a lesson generation
   * @param {string} lessonId - Lesson ID to check
   * @returns {Promise<Object>} - Status information
   */
  checkLessonStatus: async (lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking lesson status:', error);
      throw error;
    }
  },

  /**
   * Check the status of a presentation generation
   * @param {string} presentationId - Presentation ID to check
   * @returns {Promise<Object>} - Status information
   */
  checkPresentationStatus: async (presentationId) => {
    try {
      const response = await api.get(`/presentations/${presentationId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking presentation status:', error);
      throw error;
    }
  },

  /**
   * Start polling for status updates
   * @param {string} id - Content ID (lesson or presentation)
   * @param {string} type - Content type ('lesson' or 'presentation')
   * @param {Function} onStatusUpdate - Callback for status updates
   * @param {Function} onComplete - Callback when generation is complete
   * @param {Function} onError - Callback for errors
   * @returns {Function} - Function to stop polling
   */
  startStatusPolling: (id, type, onStatusUpdate, onComplete, onError) => {
    let isPolling = true;
    let pollCount = 0;
    const maxPolls = 60; // Maximum 5 minutes (5 second intervals)
    const pollInterval = 5000; // 5 seconds

    const pollStatus = async () => {
      if (!isPolling || pollCount >= maxPolls) {
        if (pollCount >= maxPolls) {
          onError(new Error('Status check timeout - please try again'));
        }
        return;
      }

      try {
        const statusData = type === 'lesson' 
          ? await webhookService.checkLessonStatus(id)
          : await webhookService.checkPresentationStatus(id);

        onStatusUpdate(statusData);

        if (statusData.status === 'completed') {
          onComplete(statusData);
          isPolling = false;
        } else if (statusData.status === 'failed') {
          onError(new Error(statusData.error || 'Generation failed'));
          isPolling = false;
        } else {
          // Continue polling
          pollCount++;
          setTimeout(pollStatus, pollInterval);
        }
      } catch (error) {
        console.error('Error during status polling:', error);
        onError(error);
        isPolling = false;
      }
    };

    // Start polling
    setTimeout(pollStatus, pollInterval);

    // Return stop function
    return () => {
      isPolling = false;
    };
  }
};

export default webhookService;
