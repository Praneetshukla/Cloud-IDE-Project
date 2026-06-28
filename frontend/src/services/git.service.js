import api from './api';

const gitService = {
  getRepository: (projectId) => api.get(`/projects/${projectId}/git`),
  createCommit: (projectId, message) => api.post(`/projects/${projectId}/git/commit`, { message })
};

export default gitService;
