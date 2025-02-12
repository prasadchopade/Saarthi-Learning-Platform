import api from './api';

const videoService = {
  // Get video details by ID
  getVideoDetails: async (videoId) => {
    const response = await api.get(`/videos/details/${videoId}`);
    return response.data;
  },

  // Generate smart notes for a video
  generateSmartNotes: async (videoId, videoTitle = 'Video Lecture') => {
    const response = await api.post('/notebook/generateSmartNotes', {
      videoId,
      videoTitle
    });
    return response.data;
  },

  // Get video transcript (if available)
  getVideoTranscript: async (videoId) => {
    const response = await api.get(`/videos/${videoId}/transcript`);
    return response.data;
  },

  // Get video chapters/timestamps (if available)
  getVideoChapters: async (videoId) => {
    const response = await api.get(`/videos/${videoId}/chapters`);
    return response.data;
  },

  // Save video progress
  saveVideoProgress: async (videoId, currentTime, duration) => {
    const response = await api.post(`/videos/${videoId}/progress`, {
      currentTime,
      duration
    });
    return response.data;
  },

  // Get video progress
  getVideoProgress: async (videoId) => {
    const response = await api.get(`/videos/${videoId}/progress`);
    return response.data;
  },

  // Add video to watchlist
  addToWatchlist: async (videoId) => {
    const response = await api.post(`/videos/${videoId}/watchlist`);
    return response.data;
  },

  // Remove video from watchlist
  removeFromWatchlist: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}/watchlist`);
    return response.data;
  },

  // Get user's watchlist
  getWatchlist: async () => {
    const response = await api.get('/videos/watchlist');
    return response.data;
  },

  // Rate a video
  rateVideo: async (videoId, rating) => {
    const response = await api.post(`/videos/${videoId}/rate`, { rating });
    return response.data;
  },

  // Get video recommendations
  getVideoRecommendations: async (videoId) => {
    const response = await api.get(`/videos/${videoId}/recommendations`);
    return response.data;
  }
};

export default videoService;
