import React from 'react';
import { LoopMark } from './LoopMark';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = 'dark',
  size = 'md',
  onClick,
}) => {
  const isDark = variant === 'dark';
  const sizeClasses = {
    sm: 'text-lg gap-2',
    md: 'text-xl sm:text-2xl gap-2.5',
    lg: 'text-3xl gap-3',
  };

  const markSizes = {
    sm: 24,
    md: 30,
    lg: 38,
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'inline-flex items-center select-none font-heading font-bold tracking-tight transition-transform active:scale-95 cursor-pointer',
        sizeClasses[size],
        className
      )}
    >
      <div className="text-indigo-600 bg-indigo-50 p-1.5 rounded-xl flex items-center justify-center border border-indigo-100/80 shadow-sm">
        <LoopMark size={markSizes[size]} className="text-indigo-600" />
      </div>
      <span className={isDark ? 'text-indigo-900' : 'text-paper'}>
        Borrow<span className="text-indigo-600">Buddy</span>
      </span>
    </div>
  );
};
