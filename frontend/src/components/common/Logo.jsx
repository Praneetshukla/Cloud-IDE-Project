import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

/**
 * Orbit branding logo — SVG icon + text.
 */
const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-lg', iconInner: 'text-sm' },
    md: { icon: 'h-9 w-9', text: 'text-xl', iconInner: 'text-base' },
    lg: { icon: 'h-12 w-12', text: 'text-3xl', iconInner: 'text-xl' },
  };

  const s = sizes[size];

  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2.5 group', className)}
    >
      <div
        className={cn(
          s.icon,
          'rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600',
          'flex items-center justify-center',
          'shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40',
          'transition-all duration-300 group-hover:scale-105'
        )}
      >
        <span className={cn('text-white font-bold', s.iconInner)}>⟡</span>
      </div>
      {showText && (
        <span
          className={cn(
            s.text,
            'font-extrabold tracking-tight gradient-text'
          )}
        >
          Orbit
        </span>
      )}
    </Link>
  );
};

export default Logo;
