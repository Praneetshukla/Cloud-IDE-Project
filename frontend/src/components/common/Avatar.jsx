import { getInitials, cn } from '../../utils/helpers';

/**
 * Avatar component with image fallback to initials.
 */
const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
    '2xl': 'h-28 w-28 text-3xl',
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex-shrink-0',
        sizes[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className={cn(
          'h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600',
          'flex items-center justify-center text-white font-semibold',
          src ? 'hidden' : 'flex'
        )}
      >
        {initials}
      </div>
    </div>
  );
};

export default Avatar;
