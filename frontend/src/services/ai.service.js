import api from './api';

const aiService = {
  getChatHistory: (projectId) => api.get(`/projects/${projectId}/ai/chat`),
  sendMessage: (projectId, message) => api.post(`/projects/${projectId}/ai/chat`, { message })
};

export default aiService;
