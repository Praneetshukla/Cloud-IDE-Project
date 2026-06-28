import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

/**
 * 404 Not Found page.
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          Page not found
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-2.5 rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm
              hover:from-indigo-600 hover:to-purple-700 transition-all duration-200
              shadow-lg shadow-indigo-500/25"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-2.5 rounded-lg
              border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium text-sm
              hover:bg-[var(--color-bg-tertiary)] transition-all duration-200"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
