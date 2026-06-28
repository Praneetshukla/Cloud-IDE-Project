import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  login,
  signup,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  clearError,
  clearMessage,
  setCredentials,
} from '../redux/slices/authSlice';

/**
 * Custom hook that wraps auth state selectors and action dispatchers.
 * Provides a clean API for components to interact with auth.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, isInitialized, error, message } =
    useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    message,

    login: useCallback((data) => dispatch(login(data)), [dispatch]),
    signup: useCallback((data) => dispatch(signup(data)), [dispatch]),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
    getMe: useCallback(() => dispatch(getMe()), [dispatch]),
    forgotPassword: useCallback((email) => dispatch(forgotPassword(email)), [dispatch]),
    resetPassword: useCallback((data) => dispatch(resetPassword(data)), [dispatch]),
    verifyEmail: useCallback((token) => dispatch(verifyEmail(token)), [dispatch]),
    clearError: useCallback(() => dispatch(clearError()), [dispatch]),
    clearMessage: useCallback(() => dispatch(clearMessage()), [dispatch]),
    setCredentials: useCallback((data) => dispatch(setCredentials(data)), [dispatch]),
  };
};

export default useAuth;
