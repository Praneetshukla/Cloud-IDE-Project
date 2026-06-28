import api from './api';
import { AUTH_ENDPOINTS } from '../utils/constants';

/**
 * Auth API service — all authentication-related HTTP calls.
 */

const authService = {
  signup: (data) => api.post(AUTH_ENDPOINTS.SIGNUP, data),

  login: (data) => api.post(AUTH_ENDPOINTS.LOGIN, data),

  logout: () => api.post(AUTH_ENDPOINTS.LOGOUT),

  refreshToken: () => api.post(AUTH_ENDPOINTS.REFRESH),

  forgotPassword: (email) =>
    api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email }),

  resetPassword: (token, data) =>
    api.post(`${AUTH_ENDPOINTS.RESET_PASSWORD}/${token}`, data),

  verifyEmail: (token) =>
    api.get(`${AUTH_ENDPOINTS.VERIFY_EMAIL}/${token}`),

  resendVerification: (email) =>
    api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email }),

  getMe: () => api.get(AUTH_ENDPOINTS.ME),
};

export default authService;
