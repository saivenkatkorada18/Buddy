import React from 'react';
import { cn } from '../../lib/utils';

interface AnimatedWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
}

export const AnimatedWordmark: React.FC<AnimatedWordmarkProps> = ({
  className,
  size = 'hero',
  showTagline = true,
}) => {
  const borrowLetters = ['B', 'o', 'r', 'r', 'o', 'w'];
  const buddyLetters = ['B', 'u', 'd', 'd', 'y'];

  const sizeClasses = {
    sm: 'text-2xl gap-2.5',
    md: 'text-3xl sm:text-4xl gap-3',
    lg: 'text-4xl sm:text-5xl gap-3.5',
    hero: 'text-4xl sm:text-5xl md:text-6xl gap-4',
  };

  const markSizes = {
    sm: 28,
    md: 40,
    lg: 48,
    hero: 58,
  };

  return (
    <div className={cn('flex flex-col items-start select-none', className)}>
      {/* Brand Title container with accessible label */}
      <div
        className={cn(
          'inline-flex items-center font-heading font-extrabold tracking-tight',
          sizeClasses[size]
        )}
        role="text"
        aria-label="BorrowBuddy"
      >
        {/* Animated Loop Mark (0ms start, 520ms duration) */}
        <div className="relative shrink-0 p-2 sm:p-2.5 bg-indigo-800/80 rounded-2xl sm:rounded-3xl border border-indigo-700/60 shadow-inner flex items-center justify-center">
          <svg
            width={markSizes[size]}
            height={markSizes[size]}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-amber-400"
            aria-hidden="true"
          >
            {/* Draw Path */}
            <path
              d="M28 50 C28 24, 72 24, 72 50 C72 76, 28 76, 28 50 Z"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 240,
                strokeDashoffset: 0,
                animation: 'loop-draw 520ms var(--ease-out-soft) forwards',
              }}
            />
            {/* Arrow Head */}
            <path
              d="M17 38 L28 49 L39 38"
              stroke="currentColor"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: 0,
                animation: 'fade-in 240ms var(--ease-out-soft) 280ms forwards',
              }}
            />
          </svg>
        </div>

        {/* Wordmark Letters Split */}
        <span className="flex items-center tracking-tight text-paper">
          {/* "Borrow" letters (320ms start, 45ms stagger, 380ms duration) */}
          <span className="inline-flex text-paper">
            {borrowLetters.map((letter, idx) => (
              <span
                key={`borrow-${idx}`}
                className="inline-block"
                style={{
                  opacity: 0,
                  transform: 'translateY(14px)',
                  animation: `letter-rise 380ms var(--ease-out-soft) ${320 + idx * 45}ms forwards`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>

          {/* "Buddy" letters (560ms start, 45ms stagger, 380ms duration) in amber/indigo highlight */}
          <span className="inline-flex text-amber-400">
            {buddyLetters.map((letter, idx) => (
              <span
                key={`buddy-${idx}`}
                className="inline-block"
                style={{
                  opacity: 0,
                  transform: 'translateY(14px)',
                  animation: `letter-rise 380ms var(--ease-out-soft) ${560 + idx * 45}ms forwards`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </span>
      </div>

      {/* Tagline: "Borrow instead of buy." (1000ms start, 280ms duration) */}
      {showTagline && (
        <p
          className="mt-3 text-base sm:text-lg text-indigo-200 font-sans font-medium italic tracking-wide"
          style={{
            opacity: 0,
            animation: 'fade-in 280ms var(--ease-out-soft) 1000ms forwards',
          }}
        >
          Borrow instead of buy.
        </p>
      )}
    </div>
  );
};
