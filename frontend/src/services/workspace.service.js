import api from './api';

const WORKSPACE_ENDPOINTS = {
  BASE: '/workspaces',
};

const workspaceService = {
  getWorkspaces: () => api.get(WORKSPACE_ENDPOINTS.BASE),
  getWorkspace: (id) => api.get(`${WORKSPACE_ENDPOINTS.BASE}/${id}`),
  createWorkspace: (data) => api.post(WORKSPACE_ENDPOINTS.BASE, data),
  updateWorkspace: (id, data) => api.patch(`${WORKSPACE_ENDPOINTS.BASE}/${id}`, data),
  deleteWorkspace: (id) => api.delete(`${WORKSPACE_ENDPOINTS.BASE}/${id}`),
};

export default workspaceService;
