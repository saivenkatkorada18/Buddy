import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  allowMultiple = false,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="bg-paper rounded-2xl border border-line shadow-rest transition-all duration-200 overflow-hidden hover:border-indigo-200"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-ink text-base sm:text-lg focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-2xl"
            >
              <span>{item.question}</span>
              <div
                className={cn(
                  'w-8 h-8 rounded-xl bg-line/40 flex items-center justify-center shrink-0 text-muted transition-transform duration-280 ease-out-soft',
                  isOpen && 'rotate-180 bg-indigo-50 text-indigo-600'
                )}
              >
                <ChevronDown size={18} />
              </div>
            </button>

            {/* CSS Grid Rows Smooth Height Transition */}
            <div className={cn('accordion-content', isOpen && 'open')}>
              <div className="accordion-inner">
                <div className="px-6 pb-6 pt-1 text-muted text-sm sm:text-base leading-relaxed border-t border-line/40">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
