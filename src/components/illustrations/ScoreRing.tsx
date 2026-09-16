import React from 'react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../lib/motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  bandLabel?: string;
  strokeColor?: string;
  live?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 110,
  strokeWidth = 9,
  className,
  showLabel = true,
  bandLabel,
  strokeColor,
  live = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100)) / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const getAutoColor = (val: number) => {
    if (val >= 85) return '#0D9488'; // Teal
    if (val >= 70) return '#4338CA'; // Indigo
    if (val >= 50) return '#F59E0B'; // Amber
    return '#78716C'; // Stone
  };

  const activeColor = strokeColor || getAutoColor(score);

  return (
    <div
      className={cn('relative inline-flex flex-col items-center justify-center shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 origin-center"
        aria-hidden="true"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E7E5E4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: live || prefersReducedMotion ? 'none' : 'stroke-dashoffset 520ms var(--ease-out-soft), stroke 250ms ease',
          }}
        />
      </svg>

      {/* Center Numeral */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span
            className="font-heading font-extrabold text-ink tabular-nums leading-none tracking-tight"
            style={{ fontSize: size * 0.32 }}
          >
            {score}
          </span>
          {bandLabel && (
            <span
              className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-0.5"
              style={{ fontSize: Math.max(size * 0.09, 9) }}
            >
              {bandLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
