import { cn } from '../../utils/helpers';

/**
 * Loading spinner with size variants.
 */
const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative">
        <svg
          className={cn('animate-spin text-indigo-500', sizes[size])}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <div
          className={cn(
            'absolute inset-0 animate-spin',
            'border-2 border-transparent border-t-purple-500 rounded-full',
            sizes[size]
          )}
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        />
      </div>
      {text && (
        <p className="text-sm text-[var(--color-text-secondary)] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Full-page loading screen used during initial auth check.
 */
export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg-primary)] z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-lg">⟡</span>
          </div>
          <span className="text-2xl font-bold gradient-text">Orbit</span>
        </div>
        <LoadingSpinner size="lg" text="Loading your workspace..." />
      </div>
    </div>
  );
};

export default LoadingSpinner;
