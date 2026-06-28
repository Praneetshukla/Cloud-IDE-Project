import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiX } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div 
        className={cn(
          "bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl w-full shadow-2xl animate-scale-in flex flex-col max-h-[90vh]",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
