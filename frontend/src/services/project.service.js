import api from './api';

const PROJECT_ENDPOINTS = {
  BASE: '/projects',
  RECENT: '/projects/recent',
};

const projectService = {
  getProjects: (params) => api.get(PROJECT_ENDPOINTS.BASE, { params }),
  getRecentProjects: () => api.get(PROJECT_ENDPOINTS.RECENT),
  createProject: (data) => api.post(PROJECT_ENDPOINTS.BASE, data),
};

export default projectService;
