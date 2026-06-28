import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Logo from '../../components/common/Logo';

/**
 * Email verification page — called when user clicks the verification link.
 */
const VerifyEmailPage = () => {
  const { token } = useParams();
  const { verifyEmail, isLoading, error, message } = useAuth();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="w-full max-w-md text-center animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] p-8 shadow-xl">
          {isLoading && (
            <div className="py-8">
              <LoadingSpinner size="lg" text="Verifying your email..." />
            </div>
          )}

          {!isLoading && message && (
            <div className="py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5">
                <HiCheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Email Verified!
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Your email has been verified successfully. You can now access all features.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg
                  bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold
                  hover:from-indigo-600 hover:to-purple-700 transition-all duration-200
                  shadow-lg shadow-indigo-500/25"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {!isLoading && error && (
            <div className="py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
                <HiXCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Verification Failed
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg
                  border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium
                  hover:bg-[var(--color-bg-tertiary)] transition-all duration-200"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
