import api from './api';

const gitService = {
  getRepository: (projectId) => api.get(`/projects/${projectId}/git`),
  createCommit: (projectId, message, filesData) => api.post(`/projects/${projectId}/git/commit`, { message, filesData }),
  revertCommit: (projectId, commitId) => api.post(`/projects/${projectId}/git/revert/${commitId}`)
};

export default gitService;
