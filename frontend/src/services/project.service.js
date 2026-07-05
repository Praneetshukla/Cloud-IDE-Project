import api from './api';

const PROJECT_ENDPOINTS = {
  BASE: '/projects',
  RECENT: '/projects/recent',
  TRASH: '/projects/trash',
};

const projectService = {
  getProjects: (params) => api.get(PROJECT_ENDPOINTS.BASE, { params }),
  getRecentProjects: () => api.get(PROJECT_ENDPOINTS.RECENT),
  getTrashedProjects: () => api.get(PROJECT_ENDPOINTS.TRASH),
  createProject: (data) => api.post(PROJECT_ENDPOINTS.BASE, data),
  toggleFavorite: (id) => api.put(`${PROJECT_ENDPOINTS.BASE}/${id}/favorite`),
  deleteProject: (id) => api.delete(`${PROJECT_ENDPOINTS.BASE}/${id}`),
  restoreProject: (id) => api.put(`${PROJECT_ENDPOINTS.BASE}/${id}/restore`),
  hardDeleteProject: (id) => api.delete(`${PROJECT_ENDPOINTS.BASE}/${id}/hard`),
};

export default projectService;
