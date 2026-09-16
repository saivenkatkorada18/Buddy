import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap } from '../../lib/motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, modalRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-paper rounded-3xl shadow-float border border-line p-6 sm:p-8 z-10 overflow-hidden transform transition-all duration-280 ease-out-soft animate-card-deal max-h-[90vh] flex flex-col',
          widthClasses[maxWidth],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line mb-6 shrink-0">
          <h2 id="modal-title" className="text-xl sm:text-2xl font-heading font-bold text-ink tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink p-1.5 rounded-xl hover:bg-line/50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
