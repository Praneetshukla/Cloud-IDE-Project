import { cn } from '../../utils/helpers';
import Logo from './Logo';

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
 * Full-page loading screen used during initial auth check and major transitions.
 * Upgraded to a highly futuristic, immersive aesthetic matching Orbit's UI.
 */
export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0f] z-[9999] overflow-hidden">
      {/* Deep Space Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#0a0a0f] to-[#0a0a0f] opacity-80 pointer-events-none"></div>
      
      {/* Animated Holographic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"></div>

      <div className="relative flex flex-col items-center gap-16">
        
        {/* Core Engine (Logo & Orbits) */}
        <div className="relative flex items-center justify-center">
          {/* Core Energy Aura */}
          <div className="absolute bg-cyan-500/20 w-[120px] h-[120px] rounded-full blur-[40px] animate-pulse"></div>
          
          {/* Rotating Holographic Orbits */}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-cyan-500/10 border-t-cyan-400/40 animate-[spin_8s_linear_infinite]"></div>
          <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-purple-500/20 animate-[spin_12s_linear_infinite_reverse]"></div>
          <div className="absolute w-[360px] h-[360px] rounded-full border border-white/5 border-b-white/20 animate-[spin_20s_linear_infinite]"></div>
          
          {/* Actual Logo inside the core */}
          <div className="relative z-10 animate-fade-in-up transition-transform duration-1000 scale-110">
            <Logo size="lg" />
          </div>
        </div>

        {/* Telemetry / Status Indicator */}
        <div className="flex flex-col items-center gap-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          
          {/* Monospace Status Text */}
          <div className="flex items-center gap-3 text-cyan-400 font-mono text-[11px] sm:text-[13px] tracking-[0.25em] uppercase shadow-cyan-400/20 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
            Establishing Connection
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.75s' }}></span>
          </div>
          
          {/* High-Tech Shimmering Progress Bar */}
          <div className="w-[280px] h-[1px] bg-white/5 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-[shimmer_3s_infinite_reverse] translate-x-[200%]"></div>
          </div>

        </div>
      </div>
      
      {/* Global CSS for the shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
