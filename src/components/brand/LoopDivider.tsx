import React from 'react';
import { cn } from '../../lib/utils';
import { LoopMark } from './LoopMark';

export const LoopDivider: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("relative py-8 flex items-center justify-center overflow-hidden opacity-25", className)} aria-hidden="true">
      <div className="h-px bg-line flex-1 max-w-xs"></div>
      <div className="px-4 text-indigo-900">
        <LoopMark size={28} />
      </div>
      <div className="h-px bg-line flex-1 max-w-xs"></div>
    </div>
  );
};
