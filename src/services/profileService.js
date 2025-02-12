import api from './api';

export const profileService = {
  getDisciplines: async () => {
    try {
      const response = await api.get('/videos/disciplines');
      return response.data.success ? response.data.disciplines : [];
    } catch (error) {
      console.error('Failed to load disciplines', error);
      throw error;
    }
  },

  getUserInterests: async () => {
    try {
      const response = await api.get('/profile/interests');
      return response.data.success ? response.data.interests : [];
    } catch (error) {
      console.error('Failed to load user interests', error);
      throw error;
    }
  },

  addInterest: async (discipline, topic) => {
    try {
      const response = await api.post('/profile/interests', { discipline, topic });
      return response.data.success ? response.data.interests : [];
    } catch (error) {
      console.error('Failed to add interest', error);
      throw error;
    }
  },

  removeInterest: async (discipline, topic) => {
    try {
      const response = await api.delete(`/profile/interests/${discipline}/${topic}`);
      return response.data.success ? response.data.interests : [];
    } catch (error) {
      console.error('Failed to remove interest', error);
      throw error;
    }
  }
};
