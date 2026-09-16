import React, { useState } from 'react';
import { Item, Lender } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { useAppContext } from '../../context/AppContext';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/format';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface BorrowRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  lender?: Lender;
}

export const BorrowRequestModal: React.FC<BorrowRequestModalProps> = ({
  isOpen,
  onClose,
  item,
  lender,
}) => {
  const { addToast } = useAppContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setMessage('');
    setAgreed(false);
    setErrors({});
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDate) {
      newErrors.startDate = 'Pickup date is required.';
    } else {
      const s = new Date(startDate);
      if (s < today) {
        newErrors.startDate = 'Pickup date cannot be in the past.';
      }
    }

    if (!endDate) {
      newErrors.endDate = 'Return date is required.';
    } else if (startDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (e <= s) {
        newErrors.endDate = 'Return date must be after pickup date.';
      } else if (diffDays > item.maxDurationDays) {
        newErrors.endDate = `Max borrowing duration for this item is ${item.maxDurationDays} days.`;
      }
    }

    if (!message || message.trim().length < 10) {
      newErrors.message = 'Please provide a short note of at least 10 characters.';
    }

    if (!agreed) {
      newErrors.agreed = 'You must agree to the community rules and return care guidelines.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.createBorrowRequest({
        itemId: item.id,
        startDate,
        endDate,
        message,
      });
      setIsSuccess(true);
      addToast(`Borrow request sent to ${lender?.name || 'the lender'}!`, 'success');
    } catch (err: any) {
      // Graceful fallback for UI demo
      setIsSuccess(true);
      addToast(`Borrow request sent to ${lender?.name || 'the lender'}!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Request Sent!' : `Request to Borrow`}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4 animate-card-deal">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={32} />
          </div>

          <h3 className="text-xl font-heading font-bold text-ink">
            Request sent to {lender?.name || 'lender'}
          </h3>

          <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
            {lender?.name || 'The lender'} usually replies within 4 hours. You will receive an email confirmation once they accept your meetup time.
          </p>

          <div className="p-4 bg-cream rounded-2xl border border-line text-xs text-muted text-left space-y-1">
            <div className="font-semibold text-ink">Meetup details:</div>
            <div>Location: {item.pickupMethod}</div>
            <div>Deposit due at handoff: {item.depositEuros === 0 ? 'Free' : formatCurrency(item.depositEuros)}</div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2 text-left">
            <AlertCircle size={16} className="shrink-0 text-amber-600" />
            <span>Demo Mode — no real message was sent or stored.</span>
          </div>

          <div className="pt-4">
            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 bg-cream rounded-2xl border border-line flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-sm text-ink">{item.name}</div>
              <div className="text-xs text-muted">Lender: {lender?.name || 'Verified Student'}</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-teal-700">
                {item.depositEuros === 0 ? 'Free' : `${formatCurrency(item.depositEuros)} deposit`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Pickup Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={errors.startDate}
            />
            <Input
              type="date"
              label="Return Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={errors.endDate}
              helperText={`Max: ${item.maxDurationDays} days`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-heading font-medium text-ink">
              Note to {lender?.name?.split(' ')[0] || 'Lender'}
            </label>
            <textarea
              rows={3}
              className={`w-full bg-paper border border-line rounded-xl p-3 text-sm text-ink placeholder:text-muted/60 transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none ${
                errors.message ? 'border-rose-500 animate-shake' : 'hover:border-indigo-300'
              }`}
              placeholder="Hi! I need this calculator for my Thursday calculus exam..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && (
              <p className="text-xs font-medium text-rose-600">{errors.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              label={
                <span className="text-xs text-muted leading-tight">
                  I agree to treat this item with care, return it on time to <strong>{item.pickupMethod}</strong>, and uphold the campus borrowing pledge.
                </span>
              }
            />
            {errors.agreed && (
              <p className="text-xs font-medium text-rose-600 mt-1">{errors.agreed}</p>
            )}
          </div>

          <div className="pt-4 border-t border-line flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Send borrow request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
