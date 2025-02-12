import api from './api';

const dashboardService = {
  async getUserInterests() {
    const res = await api.get('/profile/interests');
    return res.data;
  },

  async getTopicVideos(discipline, topic) {
    const res = await api.get(`/videos/topic/${encodeURIComponent(discipline)}/${encodeURIComponent(topic)}`);
    return res.data;
  },

  async getWatchHistory() {
    const res = await api.get('/profile/watch-history');
    return res.data;
  },

  async addToWatchHistory(videoId, title, thumbnail, channelTitle, length) {
    const res = await api.post('/profile/add-to-watch-history', { 
      videoId, 
      title, 
      thumbnail, 
      channelTitle, 
      length 
    });
    return res.data;
  }
};

export default dashboardService;



