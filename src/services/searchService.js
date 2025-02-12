import api from './api';

export const searchService = {
  searchVideos: async (query) => {
    try {
      const response = await api.get('/videos/search', {
        params: { q: query }
      });
      return response.data?.videos || [];
    } catch (error) {
      console.error('Failed to search videos', error);
      throw error;
    }
  }
};
