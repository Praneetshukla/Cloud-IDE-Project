import api from './api';

const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settingsData) => api.put('/settings', settingsData)
};

export default settingsService;
