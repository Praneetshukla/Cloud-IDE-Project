import api from './api';

const terminalService = {
  executeFile: (projectId, fileId) => api.post(`/projects/${projectId}/execute`, { fileId }),
};

export default terminalService;
