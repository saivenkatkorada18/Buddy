import React from 'react';
import { cn } from '../../lib/utils';

interface LoopMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  animateDraw?: boolean;
  animateSpin?: boolean;
  className?: string;
}

export const LoopMark: React.FC<LoopMarkProps> = ({
  size = 32,
  animateDraw = false,
  animateSpin = false,
  className,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'shrink-0 transition-transform',
        animateSpin && 'animate-loop-success',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {/* Dynamic continuous loop path */}
      <path
        d="M28 50 C28 24, 72 24, 72 50 C72 76, 28 76, 28 50 Z"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          animateDraw
            ? {
                strokeDasharray: 240,
                strokeDashoffset: 0,
                animation: 'loop-draw 1.2s var(--ease-out-soft) forwards',
              }
            : undefined
        }
      />
      {/* Forward Arrow head */}
      <path
        d="M17 38 L28 49 L39 38"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
