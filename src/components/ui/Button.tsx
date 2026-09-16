import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-semibold rounded-xl select-none transition-all duration-180 ease-out-soft active:translate-y-0.5 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-5 py-2.5 h-11 gap-2',
    lg: 'text-base px-6 py-3.5 h-13 gap-2.5',
  };

  const variants = {
    primary:
      'bg-indigo-600 text-paper shadow-rest hover:bg-indigo-700 hover:-translate-y-px hover:shadow-raise active:bg-indigo-900 border border-transparent',
    secondary:
      'bg-indigo-50 text-indigo-900 shadow-rest hover:bg-indigo-100 hover:-translate-y-px hover:shadow-raise border border-indigo-100 active:bg-indigo-200',
    outline:
      'bg-paper text-ink border border-line shadow-rest hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-px hover:shadow-raise active:bg-indigo-50',
    ghost:
      'bg-transparent text-muted hover:text-ink hover:bg-line/40 active:bg-line/60',
    danger:
      'bg-rose-600 text-paper shadow-rest hover:bg-rose-700 hover:-translate-y-px hover:shadow-raise active:bg-rose-800 border border-transparent',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
