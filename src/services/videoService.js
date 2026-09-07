import api from './api';

const videoService = {
  // Generate smart notes for a video
  generateSmartNotes: async (videoId, videoTitle = 'Video Lecture') => {
    const response = await api.post('/notebook/generateSmartNotes', {
      videoId,
      videoTitle
    });
    return response.data;
  }
};

export default videoService;
