import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InviteAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const acceptInvite = async () => {
      if (authLoading) return; // Wait for auth to initialize

      if (!isAuthenticated) {
        // Save intended invite URL to redirect back after login
        sessionStorage.setItem('redirectUrl', `/invite/${token}`);
        toast('Please log in or sign up to accept this invite', { icon: '👋' });
        navigate('/login');
        return;
      }

      try {
        const response = await api.post('/projects/invite/accept', { token });
        const { projectId } = response.data.data;
        
        setStatus('success');
        toast.success(response.data.message || 'Successfully joined the project!');
        
        // Redirect to editor
        setTimeout(() => {
          navigate(`/editor/${projectId}`);
        }, 1500);
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error.response?.data?.message || 'Failed to accept invite. The link may be invalid or expired.'
        );
      }
    };

    acceptInvite();
  }, [token, isAuthenticated, authLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-xl">
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <h2 className="mt-6 text-xl font-semibold text-text-primary">Processing Invitation...</h2>
            <p className="mt-2 text-text-secondary text-sm">Please wait while we verify your access.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Invite Accepted!</h2>
            <p className="mt-2 text-text-secondary text-sm">Redirecting to the project editor...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Invalid Invitation</h2>
            <p className="mt-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">{errorMessage}</p>
            <Link 
              to="/dashboard"
              className="mt-6 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors w-full"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteAcceptPage;
