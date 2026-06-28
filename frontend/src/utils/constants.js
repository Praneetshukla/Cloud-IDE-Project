/**
 * Frontend application constants.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AUTH_ENDPOINTS = {
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  GOOGLE: '/auth/google',
  GITHUB: '/auth/github',
  ME: '/auth/me',
};

export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  AVATAR: '/users/avatar',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_EMAIL: '/verify-email/:token',
  OAUTH_CALLBACK: '/oauth/callback',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;

export const TOAST_DURATION = 4000;
