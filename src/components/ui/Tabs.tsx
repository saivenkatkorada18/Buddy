import React from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'line';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}) => {
  return (
    <div
      role="tablist"
      aria-label="Navigation Tabs"
      className={cn(
        'relative inline-flex p-1 rounded-2xl bg-line/40 border border-line/60 gap-1 select-none',
        variant === 'line' && 'bg-transparent border-0 border-b border-line rounded-none p-0 gap-6',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-all duration-180 ease-out-soft flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-600',
              isActive
                ? 'bg-paper text-indigo-900 shadow-rest'
                : 'text-muted hover:text-ink hover:bg-paper/40',
              variant === 'line' &&
                (isActive
                  ? 'border-b-2 border-indigo-600 text-indigo-900 rounded-none bg-transparent shadow-none pb-3'
                  : 'text-muted hover:text-ink border-b-2 border-transparent rounded-none bg-transparent pb-3')
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-mono font-bold transition-colors',
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-line/80 text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
