import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/constants';

/**
 * Google and GitHub OAuth sign-in buttons.
 * These redirect directly to the backend OAuth endpoints.
 */
const OAuthButtons = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2.5
          rounded-lg border border-[var(--color-border)] cursor-pointer
          bg-[var(--color-bg-input)] text-[var(--color-text-secondary)]
          hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-hover)]
          transition-all duration-200 text-sm font-medium"
      >
        <FcGoogle className="h-5 w-5" />
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={handleGithubLogin}
        className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2.5
          rounded-lg border border-[var(--color-border)] cursor-pointer
          bg-[var(--color-bg-input)] text-[var(--color-text-secondary)]
          hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-hover)]
          transition-all duration-200 text-sm font-medium"
      >
        <FaGithub className="h-5 w-5" />
        <span>GitHub</span>
      </button>
    </div>
  );
};

export default OAuthButtons;
