import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

/**
 * Orbit branding logo — full image (icon + text).
 */
const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { wrapper: 'h-9 mt-1.5 -ml-1' }, // Smaller and bumped down slightly to visually center with text
    md: { wrapper: 'h-12 mt-1' },        // Balanced for Auth screens
    lg: { wrapper: 'h-16 mt-2' },        // Balanced for 404 / large splash screens
  };

  const s = sizes[size];

  return (
    <Link
      to="/"
      className={cn('flex items-center group', className)}
    >
      <div
        className={cn(
          s.wrapper,
          'flex items-center transition-transform duration-300 group-hover:scale-105 overflow-visible'
        )}
      >
        <img 
          src="/logo.png?v=final-crop-2" 
          alt="Orbit Logo" 
          className="h-full w-auto object-contain drop-shadow-md" 
          style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }} 
        />
      </div>
    </Link>
  );
};

export default Logo;
