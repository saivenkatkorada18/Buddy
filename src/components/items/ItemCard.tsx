import React from 'react';
import { Item, Lender } from '../../types';
import { formatCurrency, formatDistance, isAvailableNow } from '../../lib/format';
import { ItemArtwork } from './ItemArtwork';
import { Badge } from '../ui/Badge';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { lenders } from '../../data/users';

interface ItemCardProps {
  item: Item;
  lender?: Lender;
  className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, lender: propLender, className }) => {
  const { navigate, setSelectedItemId } = useAppContext();
  const available = isAvailableNow(item.availableFrom) && item.available;
  const lender = propLender || (item.lenderId in lenders ? lenders[item.lenderId] : undefined);

  const handleClick = () => {
    setSelectedItemId(item.id);
    navigate('item-detail', item.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'group text-left bg-paper rounded-2xl border border-line p-3.5 flex flex-col justify-between transition-all duration-200 ease-out-soft shadow-rest hover:shadow-raise hover:-translate-y-1 hover:border-indigo-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-indigo-600',
        className
      )}
    >
      <div>
        {/* Clipped container so artwork scales 1.03 inside */}
        <div className="relative overflow-hidden rounded-xl bg-cream">
          <ItemArtwork category={item.category} seed={item.imageSeed} name={item.name} size="md" />

          {/* Status & Category Overlays */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-20">
            {available ? (
              <Badge variant="success" size="sm">Available</Badge>
            ) : (
              <Badge variant="warning" size="sm">Due soon</Badge>
            )}
            {item.depositEuros === 0 && (
              <Badge variant="info" size="sm">Free</Badge>
            )}
          </div>

          {/* Lender Trust Tag */}
          {lender && (
            <div className="absolute bottom-2.5 right-2.5 bg-paper/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-line text-xs font-semibold text-ink flex items-center gap-1.5 shadow-sm opacity-90 transition-opacity group-hover:opacity-100 z-20">
              <ShieldCheck size={13} className="text-teal-600" />
              <span className="tabular-nums font-mono text-teal-700">{lender.trustScore}</span>
            </div>
          )}
        </div>

        {/* Item Title & Category */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted uppercase tracking-wider capitalize">
              {item.category.replace('-', ' ')}
            </span>
            <span className="text-xs font-semibold text-muted flex items-center gap-1">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span className="tabular-nums">{item.rating.toFixed(1)}</span>
            </span>
          </div>

          <h3 className="font-heading font-bold text-ink text-base mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.name}
          </h3>
        </div>
      </div>

      {/* Footer Info: Location & Deposit */}
      <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-1 truncate max-w-[150px]">
          <MapPin size={13} className="text-muted shrink-0" />
          <span className="truncate">{item.campus}</span>
          <span className="tabular-nums shrink-0 font-medium">({formatDistance(item.distanceKm)})</span>
        </div>

        <div className="font-semibold text-ink shrink-0 tabular-nums">
          {item.depositEuros === 0 ? (
            <span className="text-teal-700 font-bold">Free</span>
          ) : (
            <span>{formatCurrency(item.depositEuros)} <span className="text-muted font-normal">dep.</span></span>
          )}
        </div>
      </div>
    </div>
  );
};
