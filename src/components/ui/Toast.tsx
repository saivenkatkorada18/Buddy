import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
        onClose(id);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex items-center gap-3 bg-paper border border-line shadow-raise rounded-2xl p-4 pr-10 min-w-[300px] max-w-md overflow-hidden animate-card-deal transition-all"
    >
      {icons[type]}
      <p className="text-sm font-medium text-ink flex-1 leading-snug">{message}</p>
      
      <button
        onClick={() => onClose(id)}
        className="absolute right-2.5 top-3.5 text-muted hover:text-ink p-1 rounded-lg hover:bg-line/40 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>

      {/* Draining bottom edge progress line */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-indigo-600/70 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
