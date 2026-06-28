import api from './api';
import { USER_ENDPOINTS } from '../utils/constants';

/**
 * User API service — profile management HTTP calls.
 */

const userService = {
  getProfile: () => api.get(USER_ENDPOINTS.PROFILE),

  updateProfile: (data) => api.patch(USER_ENDPOINTS.PROFILE, data),

  changePassword: (data) =>
    api.patch(USER_ENDPOINTS.CHANGE_PASSWORD, data),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(USER_ENDPOINTS.AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteAvatar: () => api.delete(USER_ENDPOINTS.AVATAR),

  getStats: () => api.get('/users/stats'),
};

export default userService;
