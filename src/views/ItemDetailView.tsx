import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { items } from '../data/items';
import { lenders } from '../data/users';
import { ItemArtwork } from '../components/items/ItemArtwork';
import { ItemCard } from '../components/items/ItemCard';
import { BorrowRequestModal } from '../components/items/BorrowRequestModal';
import { ScoreRing } from '../components/illustrations/ScoreRing';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { formatCurrency, formatDistance, isAvailableNow } from '../lib/format';
import { calculateTrustScore } from '../lib/trust';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CreditCard,
} from 'lucide-react';

export const ItemDetailView: React.FC = () => {
  const { selectedItemId, navigate, isLoggedIn, setAuthModalOpen, addToast, openPaymentModal } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);


  const item = items.find(i => i.id === selectedItemId) || items[0];
  const lender = (item.lenderId in lenders ? lenders[item.lenderId] : Object.values(lenders)[0]) || Object.values(lenders)[0];
  const available = isAvailableNow(item.availableFrom) && item.available;

  const trustBreakdown = calculateTrustScore(
    lender.onTimeReturns,
    lender.verifiedEmail,
    lender.avgConditionRating,
    lender.completedBorrows + lender.completedLends
  );

  const relatedItems = items.filter(i => i.category === item.category && i.id !== item.id).slice(0, 3);

  const thumbnailSeeds = [item.imageSeed, `${item.imageSeed}-alt1`, `${item.imageSeed}-alt2`];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <button
          onClick={() => navigate('explore')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to all listings</span>
        </button>

        {/* Main 2-Column Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-paper p-4 rounded-3xl border border-line shadow-raise">
              <ItemArtwork
                category={item.category}
                seed={thumbnailSeeds[activeThumbnailIndex]}
                name={item.name}
                size="lg"
                className="rounded-2xl"
              />
            </div>

            {/* 3 Selectable Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {thumbnailSeeds.map((seed, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumbnailIndex(idx)}
                  className={`p-1.5 rounded-2xl border transition-all duration-180 bg-paper ${
                    activeThumbnailIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-sm'
                      : 'border-line hover:border-indigo-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ItemArtwork category={item.category} seed={seed} name={item.name} size="sm" className="rounded-xl h-16 w-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Request Card (6 cols) */}
          <div className="lg:col-span-6 bg-paper rounded-3xl p-6 sm:p-8 border border-line shadow-rest space-y-6">
            
            {/* Header: Status, Category, Title */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading font-bold text-muted uppercase tracking-wider capitalize">
                    {item.category.replace('-', ' ')}
                  </span>
                  <span className="text-muted">•</span>
                  <Badge variant={available ? 'success' : 'warning'}>
                    {available ? 'Available Now' : 'Reserved / Due soon'}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-muted bg-cream px-2.5 py-1 rounded-full border border-line">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span className="tabular-nums font-bold text-ink">{item.rating.toFixed(1)}</span>
                  <span>({item.borrowCount} borrows)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
                {item.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-muted mt-2">
                <span className="font-semibold text-ink">Condition:</span>
                <span className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded-md font-medium">
                  {item.condition}
                </span>
                <span className="text-muted">•</span>
                <MapPin size={13} className="text-muted" />
                <span>{item.campus} ({formatDistance(item.distanceKm)})</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed pt-2 border-t border-line/60">
              {item.description}
            </p>

            {/* Lender Profile Card with Trust Score */}
            <div className="p-4 bg-cream rounded-2xl border border-line flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <Avatar initials={lender.initials} colorClass={lender.avatarColor} size="lg" />
                <div>
                  <div className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
                    {lender.name}
                    {lender.verifiedEmail && (
                      <span title="Verified Student Email">
                        <ShieldCheck size={15} className="text-teal-600" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted">{lender.course}</div>
                  <div className="text-[11px] text-teal-800 font-semibold mt-0.5 flex items-center gap-1">
                    <span>{lender.completedLends} campus lends</span>
                    <span>•</span>
                    <span>{lender.onTimeReturns[0]}/{lender.onTimeReturns[1]} on time</span>
                  </div>
                </div>
              </div>

              <ScoreRing score={lender.trustScore} size={64} strokeWidth={6} bandLabel={trustBreakdown.band} />
            </div>

            {/* Borrow Terms & Deposit Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-cream rounded-xl border border-line text-xs">
                <div className="text-muted font-medium">Deposit required</div>
                <div className="font-heading font-bold text-base text-ink mt-0.5">
                  {item.depositEuros === 0 ? (
                    <span className="text-teal-700">Free (No deposit)</span>
                  ) : (
                    <span>{formatCurrency(item.depositEuros)}</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-cream rounded-xl border border-line text-xs">
                <div className="text-muted font-medium">Suggested duration</div>
                <div className="font-heading font-bold text-base text-ink mt-0.5">
                  {item.suggestedDurationDays} days <span className="text-muted text-xs font-normal">(Max: {item.maxDurationDays}d)</span>
                </div>
              </div>
            </div>

            {/* Lender Handoff Rules */}
            <div className="space-y-2">
              <div className="text-xs font-heading font-bold text-muted uppercase tracking-wider">
                Lender Rules & Pickup Note
              </div>
              <ul className="space-y-1.5 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                  <span>Pickup location: <strong>{item.pickupMethod}</strong></span>
                </li>
                {item.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 border-t border-line space-y-2.5">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  if (!isLoggedIn) setAuthModalOpen(true);
                  else setIsModalOpen(true);
                }}
              >
                Request to borrow item
              </Button>

              <button
                type="button"
                onClick={() =>
                  openPaymentModal({
                    amount: item.depositEuros > 0 ? item.depositEuros * 90 : 150,
                    itemName: item.name,
                    itemId: item.id,
                    purpose: `Security Deposit for ${item.name}`,
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-heading font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-all shadow-xs"
              >
                <CreditCard size={15} className="text-amber-600" />
                <span>Pay Demo Security Deposit with Razorpay</span>
                <span className="bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded text-[10px]">Test Mode</span>
              </button>
            </div>


          </div>

        </div>

        {/* Related Category Items Row */}
        {relatedItems.length > 0 && (
          <div className="pt-12 border-t border-line">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold text-ink">
                Other {item.category.replace('-', ' ')} listings
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('explore')}>
                View all in Explore
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedItems.map(rel => (
                <ItemCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Borrow Request Modal */}
      <BorrowRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        lender={lender}
      />
    </div>
  );
};
