import * as React from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-line rounded-3xl bg-cream/50",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
