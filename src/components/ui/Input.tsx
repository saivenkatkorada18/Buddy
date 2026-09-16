import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-heading font-medium text-ink tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={hasError}
            className={cn(
              'w-full bg-paper border border-line rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-all duration-180 ease-out-soft shadow-rest',
              'hover:border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError && 'border-rose-500 ring-rose-500/20 animate-shake',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-muted flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {typeof error === 'string' && error && (
          <p className="text-xs font-medium text-rose-600 animate-card-deal">{error}</p>
        )}
        {helperText && !hasError && (
          <p className="text-xs text-muted leading-relaxed">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
