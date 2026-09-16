import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'stone' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      success: 'bg-teal-100 text-teal-800 border-teal-200',
      warning: 'bg-amber-100 text-amber-900 border-amber-200',
      info: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      stone: 'bg-stone-100 text-stone-800 border-stone-200',
      neutral: 'bg-line/70 text-muted border-line',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[11px] font-semibold',
      md: 'px-2.5 py-0.5 text-xs font-semibold',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border shadow-2xs select-none tracking-tight font-heading',
          variants[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
