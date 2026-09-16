import React from 'react';
import { cn } from '../../lib/utils';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-start gap-3 select-none cursor-pointer group text-sm',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={cn(
            'w-5 h-5 rounded-lg border border-line bg-paper flex items-center justify-center transition-all duration-180 ease-out-soft peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600 peer-focus-visible:ring-offset-2 group-hover:border-indigo-400',
            checked && 'bg-indigo-600 border-indigo-600 shadow-sm'
          )}
        >
          {/* Animated SVG Checkmark Path */}
          <svg
            className={cn(
              'w-3.5 h-3.5 text-paper stroke-[3] transition-all duration-150 ease-spring',
              checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      {label && <div className="text-ink leading-tight pt-0.5">{label}</div>}
    </label>
  );
};
