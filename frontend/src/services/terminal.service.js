import api from './api';

const terminalService = {
  executeFile: (projectId, fileId, content) => api.post(`/projects/${projectId}/execute`, { fileId, content }),
};

export default terminalService;
