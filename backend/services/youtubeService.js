const { Innertube } = require('youtubei.js');
class YoutubeService {
  constructor() {
    this.ytClient = null;
    this.initClient();
  }

  formatDuration(duration) {//duration is in seconds
    duration = duration.toString();
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}:${minutes}:${seconds}`;
  }

  // Initialize the YouTube client
  async initClient() {
    try {
      this.ytClient = await Innertube.create({
        lang: 'en',
        location: 'US',
        retrieve_player: true,
      });
    } catch (error) {
      console.error('Failed to initialize YouTube client:', error);
    }
  }
 
  /**
   * Get videos for a specific topic
   * @param {string} topic - Topic name
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Array>} Array of video objects
   */
  async getTopicVideos(topic, limit = 20) {
    try {
      // Ensure client is initialized
      if (!this.ytClient) await this.initClient();
      
      const query = `${topic} tutorial`;
      const searchResults = await this.ytClient.search(query, { type: 'video', limit });
      
      const items = searchResults.videos.map(video => ({
        id: video.id,
        title: video.title.text,
        thumbnail: {
          thumbnails: [
            { url: video.thumbnails[0]?.url || '', width: video.thumbnails[0]?.width || 0, height: video.thumbnails[0]?.height || 0 },
            { url: video.thumbnails[1]?.url || '', width: video.thumbnails[1]?.width || 0, height: video.thumbnails[1]?.height || 0 }
          ]
        },
        length: video.duration?.text || '0:00',
        channelTitle: video.author?.name || ''
      }));
      
      return items || [];
    } catch (error) {
      console.error(`Error fetching videos for topic ${topic}:`, error);
      throw new Error(`Failed to fetch videos for topic ${topic}`);
    }
  }

  async searchVideos(searchQuery) {
    try {
      // Ensure client is initialized
      if (!this.ytClient) await this.initClient();

      const searchResults = await this.ytClient.search(searchQuery, {
        type: 'video',
        filters: {
          duration: 'medium'
        },
        sort_by: 'relevance',
        hl: 'en',
        gl: 'US'
      });
  
      // Limit to 1 video
      const videos = searchResults.videos
        .slice(0, 15)
        .map(video => ({
          id: video.id,
          title: video.title.text,
          channelTitle: video.author?.name || '',
          thumbnail: {
            medium: video.thumbnails[0] ? {
              url: video.thumbnails[0].url,
              width: video.thumbnails[0].width,
              height: video.thumbnails[0].height
            } : {},
            high: video.thumbnails[video.thumbnails.length - 1] ? {
              url: video.thumbnails[video.thumbnails.length - 1].url,
              width: video.thumbnails[video.thumbnails.length - 1].width,
              height: video.thumbnails[video.thumbnails.length - 1].height
            } : {}
          },
          length: video.duration?.text || '0:00',
        }));
      return videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw new Error('Failed to fetch videos');
    }
  }

}

module.exports = new YoutubeService();