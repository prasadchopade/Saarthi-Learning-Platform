import api from './api';

const lessonService = {
  // Create a new lesson from topic, link, or file
  createLesson: async (input, mode) => {
    const formData = new FormData();
    formData.append('mode', mode); // 'exam_prep', 'deep_learning', 'quick_summary'
    
    // Handle different input types
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
  
  // Get all lessons for the current user
  getLessons: async () => {
    const response = await api.get('/lessons');
    return response.data;
  },
  
  // Get a specific lesson by ID
  getLessonById: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },
  
  // Update slide content
  updateSlide: async (lessonId, slideId, content) => {
    const response = await api.put(`/lessons/${lessonId}/slides/${slideId}`, { content });
    return response.data;
  },
  
  // Generate additional content for a slide
  explainMore: async (lessonId, slideId) => {
    const response = await api.post(`/lessons/${lessonId}/slides/${slideId}/explain`);
    return response.data;
  },
  
  // Summarize slide content
  summarizeSlide: async (lessonId, slideId) => {
    const response = await api.post(`/lessons/${lessonId}/slides/${slideId}/summarize`);
    return response.data;
  },
  
  // Answer a specific question about the content
  askAI: async (lessonId, slideId, question) => {
    const response = await api.post(`/lessons/${lessonId}/slides/${slideId}/ask`, { question });
    return response.data;
  },
  
  // Generate quiz based on lesson content
  generateQuiz: async (lessonId) => {
    const response = await api.post(`/lessons/${lessonId}/quiz`);
    return response.data;
  },
  
  // Export lesson in different formats
  exportLesson: async (lessonId, format) => {
    const response = await api.get(`/lessons/${lessonId}/export/${format}`, {
      responseType: 'blob' // Important for binary responses
    });
    
    // Create download link for exported file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename based on format
    const extension = format === 'ppt' ? 'pptx' : 
                      format === 'web' ? 'html' :
                      format === 'anki' ? 'apkg' : 'zip';
    
    link.setAttribute('download', `lesson-${lessonId}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  }
};

export default lessonService;
