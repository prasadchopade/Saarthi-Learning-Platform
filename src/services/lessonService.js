import api from './api';

/**
 * Video lessons are not built yet - the API has no /lessons routes, and the
 * option is disabled in the creator. Only the two calls the UI would make are
 * kept here so the feature has somewhere to land when the backend exists.
 */
const lessonService = {
  // Create a new lesson from a topic, link, or file
  createLesson: async (input, mode) => {
    const formData = new FormData();
    formData.append('mode', mode);

    if (input.type === 'topic') {
      formData.append('topic', input.content);
    } else if (input.type === 'youtube') {
      formData.append('youtube_url', input.content);
    } else if (input.type === 'pdf') {
      formData.append('pdf', input.file);
    }

    const response = await api.post('/lessons/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  // Get a specific lesson by ID
  getLesson: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  }
};

export default lessonService;
