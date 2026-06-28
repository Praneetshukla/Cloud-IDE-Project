import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FullPageLoader } from '../common/LoadingSpinner';

/**
 * Protected route wrapper.
 * Redirects to login if user is not authenticated.
 * Shows loading screen during initial auth check.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Protected content.
 * @param {string[]} [props.roles] - Required roles (RBAC). Empty = any authenticated user.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();

  // Still checking auth status on initial load
  if (!isInitialized && localStorage.getItem('accessToken')) {
    return <FullPageLoader />;
  }

  // Not authenticated — redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access check
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
