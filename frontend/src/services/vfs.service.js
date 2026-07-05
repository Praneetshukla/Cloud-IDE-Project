import api from './api';

const VFS_ENDPOINTS = {
  PROJECTS: '/projects',
  FOLDERS: '/folders',
  FILES: '/files',
};

const vfsService = {
  // Tree
  getProjectTree: (projectId) => api.get(`${VFS_ENDPOINTS.PROJECTS}/${projectId}/tree`),
  
  // Folders
  createFolder: (data) => api.post(VFS_ENDPOINTS.FOLDERS, data),
  updateFolder: (id, data) => api.patch(`${VFS_ENDPOINTS.FOLDERS}/${id}`, data),
  deleteFolder: (id) => api.delete(`${VFS_ENDPOINTS.FOLDERS}/${id}`),
  
  // Files
  createFile: (data) => api.post(VFS_ENDPOINTS.FILES, data),
  createBatchFiles: (data) => api.post(`${VFS_ENDPOINTS.FILES}/batch`, data),
  getFile: (id) => api.get(`${VFS_ENDPOINTS.FILES}/${id}`),
  updateFile: (id, data) => api.patch(`${VFS_ENDPOINTS.FILES}/${id}`, data),
  deleteFile: (id) => api.delete(`${VFS_ENDPOINTS.FILES}/${id}`),
};

export default vfsService;
