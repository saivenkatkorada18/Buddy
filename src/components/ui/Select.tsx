import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | boolean;
  options: (SelectOption | string)[];
}

export const Select: React.FC<SelectProps> = ({
  className,
  label,
  error,
  options,
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-heading font-medium text-ink tracking-tight"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={hasError}
          className={cn(
            'w-full bg-paper border border-line rounded-xl px-4 py-2.5 pr-10 text-sm text-ink appearance-none transition-all duration-180 ease-out-soft shadow-rest',
            'hover:border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none',
            hasError && 'border-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
          <ChevronDown size={16} />
        </div>
      </div>
      {typeof error === 'string' && error && (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
};
