import { HiCheckCircle, HiExclamation, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

/**
 * Alert banner component with status variants.
 */
const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null;

  const config = {
    success: {
      icon: HiCheckCircle,
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400',
    },
    error: {
      icon: HiXCircle,
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-400',
    },
    warning: {
      icon: HiExclamation,
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
    },
    info: {
      icon: HiInformationCircle,
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'text-blue-400',
    },
  };

  const { icon: Icon, bg, text } = config[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg border animate-fade-in-down',
        bg,
        className
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', text)} />
      <p className={cn('text-sm flex-1', text)}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={cn('flex-shrink-0 cursor-pointer', text, 'hover:opacity-70')}
        >
          <HiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
