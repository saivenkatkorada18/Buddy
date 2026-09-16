import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorClass?: string;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, colorClass = 'bg-indigo-600', ...props }, ref) => {
    // Clamp between 0 and 100
    const percentage = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn("h-2.5 w-full overflow-hidden rounded-full bg-cream", className)}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
