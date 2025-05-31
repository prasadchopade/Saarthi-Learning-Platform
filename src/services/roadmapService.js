import api from './api';
import axios from 'axios';

const roadmapService = {
  async getRoadmaps() {
    const res = await api.get('/roadmaps');
    return res.data;
  },

  async getMyRoadmaps() {
    const res = await api.get('/roadmaps/my-roadmaps');
    return res.data;
  },

  async createRoadmap(roadmapData) {
    const res = await api.post('/roadmaps', roadmapData);
    return res.data;
  },

  async deleteRoadmap(roadmapId) {
    const res = await api.delete(`/roadmaps/${roadmapId}`);
    return res.data;
  },

  async getRoadmapById(roadmapId) {
    const res = await api.get(`/roadmaps/${roadmapId}`);
    return res.data;
  },

  async getRoadmapProgress(roadmapId) {
    const res = await api.get(`/roadmaps/${roadmapId}/progress`);
    return res.data;
  },

  async updateSubtopicProgress(roadmapId, topicSequence, subtopicId, completed) {
    const res = await api.post(`/roadmaps/${roadmapId}/progress`, { 
      topicSequence, 
      subtopicId, 
      completed 
    });
    return res.data;
  },

  async getRoadmapContent(roadmapId, topicSequence, subtopicId) {
    const res = await api.post(`/roadmaps/${roadmapId}/content`, {
      topicSequence,
      subtopicId
    });
    return res.data;
  },

  async generateNotes(roadmapId, topicSequence, subtopicId) {
    const res = await api.post(`/roadmaps/${roadmapId}/generate-notes`, {
      topicSequence,
      subtopicId
    });
    return res.data;
  },

  async downloadPdfNotes(roadmapId, topicSequence, subtopicId) {
    try {
      // Goes through the shared instance so the Authorization header is
      // attached. Bypassing it meant this request carried no bearer token and
      // always came back 401 once auth moved off cross-site cookies.
      // responseType is per-request, so blob handling still works.
      const response = await api({
        method: 'post',
        url: `/roadmaps/${roadmapId}/generate-pdf-notes`,
        data: {
          topicSequence,
          subtopicId
        },
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      // Check if we got a PDF (sometimes error responses come as JSON)
      if (response.data.type && response.data.type.includes('application/json')) {
        // Convert blob to text to read the error
        const errorText = await response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Failed to generate PDF');
      }
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from response headers if available, otherwise use a generic name
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'notes.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      
      // Append the link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up by revoking the object URL
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
};

export default roadmapService;
