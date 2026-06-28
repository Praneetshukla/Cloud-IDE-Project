import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FullPageLoader } from '../../components/common/LoadingSpinner';

/**
 * OAuth callback handler.
 * After Google/GitHub OAuth, the backend redirects here with the access token
 * as a query parameter. This page stores the token and fetches the user profile.
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getMe, setCredentials } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    if (token) {
      // Store the access token and fetch user data
      localStorage.setItem('accessToken', token);
      setCredentials({ accessToken: token, user: null });

      getMe()
        .unwrap()
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          navigate('/login?error=oauth_failed', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, getMe, setCredentials]);

  return <FullPageLoader />;
};

export default OAuthCallbackPage;
