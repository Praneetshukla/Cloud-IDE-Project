import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuth from './hooks/useAuth';
import useDarkMode from './hooks/useDarkMode';
import { FullPageLoader } from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

// App Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import WorkspacePage from './pages/workspace/WorkspacePage';
import EditorPage from './pages/editor/EditorPage';
import NotFoundPage from './pages/NotFoundPage';
import InviteAcceptPage from './pages/project/InviteAcceptPage';

/**
 * Root application component.
 * Handles initial auth check, routing, dark mode, and toast notifications.
 */
const App = () => {
  const { getMe, isInitialized, isAuthenticated } = useAuth();

  // Initialize dark mode (adds/removes class on <html>)
  useDarkMode();

  // On mount, check if user has a valid session (access token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getMe();
    }
  }, [getMe]);

  // Show loader until initial auth check completes
  // (only if there's a token to check — otherwise show routes immediately)
  if (!isInitialized && localStorage.getItem('accessToken')) {
    return <FullPageLoader />;
  }

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: 'var(--shadow-lg)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <Routes>
        {/* ─── Public Auth Routes ──────────────────────────────── */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* ─── Protected Routes (Dashboard Shell) ─────────────── */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workspaces/:id" element={<WorkspacePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* ─── Editor Route (Full Screen, No Dashboard Shell) ─── */}
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        {/* ─── Invite Accept Route ──────────────────────────────── */}
        <Route path="/invite/:token" element={<InviteAcceptPage />} />

        {/* ─── Redirects & Fallback ───────────────────────────── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
