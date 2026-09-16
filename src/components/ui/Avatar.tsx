import * as React from "react";
import { cn } from "../../lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, initials, colorClass = 'bg-indigo-100 text-indigo-700', size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full font-semibold shrink-0 select-none",
          colorClass,
          sizes[size],
          className
        )}
        {...props}
      >
        {initials.toUpperCase().substring(0, 2)}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
