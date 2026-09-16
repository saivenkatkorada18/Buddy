import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAppContext } from '../../context/AppContext';
import { Item, Category, Campus } from '../../types';
import { ImagePlus, CheckCircle2, AlertCircle } from 'lucide-react';

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated?: (newItem: Item) => void;
}

export const ListItemModal: React.FC<ListItemModalProps> = ({
  isOpen,
  onClose,
  onItemCreated,
}) => {
  const { addToast, user } = useAppContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('calculators');
  const [condition, setCondition] = useState<'New' | 'Like new' | 'Good' | 'Fair'>('Like new');
  const [description, setDescription] = useState('');
  const [campus, setCampus] = useState<Campus>('Main Library');
  const [pickupMethod, setPickupMethod] = useState('');
  const [maxDurationDays, setMaxDurationDays] = useState('7');
  const [deposit, setDeposit] = useState('0');
  const [rules, setRules] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPickupMethod('');
    setMaxDurationDays('7');
    setDeposit('0');
    setRules('');
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.length < 3) errs.name = 'Item title must be at least 3 characters.';
    if (!description.trim() || description.length < 10) errs.description = 'Provide a description of at least 10 characters.';
    if (!pickupMethod.trim()) errs.pickup = 'Specify a campus pickup spot (e.g. SU cafe).';
    if (isNaN(parseInt(maxDurationDays)) || parseInt(maxDurationDays) <= 0) errs.duration = 'Valid borrow duration required.';
    if (isNaN(parseInt(deposit)) || parseInt(deposit) < 0) errs.deposit = 'Valid deposit required (0 for free).';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newItem: Item = {
        id: `i_${Date.now()}`,
        name,
        category,
        condition,
        description,
        rules: rules ? rules.split('\n').filter(Boolean) : ['Handle with reasonable student care'],
        campus,
        distanceKm: 0.3,
        maxDurationDays: parseInt(maxDurationDays),
        suggestedDurationDays: Math.min(3, parseInt(maxDurationDays)),
        depositEuros: parseInt(deposit),
        available: true,
        availableFrom: new Date().toISOString(),
        pickupMethod,
        rating: 5.0,
        borrowCount: 0,
        lenderId: user?.id || 'l_alex',
        addedAt: new Date().toISOString(),
        imageSeed: `custom-${Date.now()}`,
      };

      if (onItemCreated) {
        onItemCreated(newItem);
      }

      setIsSubmitting(false);
      handleClose();
      addToast(`"${name}" is now listed in your campus directory!`, 'success');
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="List an Item on Campus" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <Input
          label="Item Title"
          placeholder="e.g. Texas Instruments TI-84 Plus, Lab Goggles"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            options={[
              { value: 'calculators', label: 'Calculators & Electronics' },
              { value: 'lab-coats', label: 'Lab Coats & Safety Gear' },
              { value: 'chargers', label: 'Chargers & Adapters' },
              { value: 'books', label: 'Textbooks & Readers' },
              { value: 'sports', label: 'Sports & Fitness Gear' },
              { value: 'tools', label: 'Tools & Hardware' },
              { value: 'kitchen', label: 'Dorm Kitchen Items' },
              { value: 'stationery', label: 'Drafting & Stationery' },
              { value: 'umbrellas', label: 'Umbrellas' },
              { value: 'decor', label: 'Room Decor & Ambient Lights' },
            ]}
          />

          <Select
            label="Item Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as any)}
            options={['New', 'Like new', 'Good', 'Fair']}
          />
        </div>

        {/* Styled Image Dropzone Labelled as Demo */}
        <div className="space-y-1.5">
          <label className="block text-sm font-heading font-medium text-ink">Item Visual</label>
          <div className="border-2 border-dashed border-line hover:border-indigo-300 rounded-2xl p-6 text-center bg-cream transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
              <ImagePlus size={20} />
            </div>
            <div className="text-xs font-semibold text-ink">Deterministic Vector Artwork Generator Active</div>
            <div className="text-[11px] text-muted mt-0.5">
              Visual art will automatically generate based on your category choice. (Demo: upload disabled)
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-heading font-medium text-ink">Item Description</label>
          <textarea
            rows={3}
            placeholder="Include brand, edition, specs, or special accessories..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full bg-paper border border-line rounded-xl p-3 text-sm text-ink placeholder:text-muted/60 transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none ${
              errors.description ? 'border-rose-500 animate-shake' : 'hover:border-indigo-300'
            }`}
          />
          {errors.description && (
            <p className="text-xs font-medium text-rose-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Primary Campus Zone"
            value={campus}
            onChange={(e) => setCampus(e.target.value as Campus)}
            options={[
              'Main Library',
              'Science Building',
              'Student Residence Hall',
              'Campus Sports Centre',
              'Engineering Block',
              'Student Union',
            ]}
          />

          <Input
            label="Exact Pickup Spot"
            placeholder="e.g. 2nd Floor Library Foyer"
            value={pickupMethod}
            onChange={(e) => setPickupMethod(e.target.value)}
            error={errors.pickup}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            min="1"
            max="120"
            label="Max Duration (Days)"
            value={maxDurationDays}
            onChange={(e) => setMaxDurationDays(e.target.value)}
            error={errors.duration}
          />
          <Input
            type="number"
            min="0"
            label="Deposit (₹)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            error={errors.deposit}
            helperText="0 = Free to borrow"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-heading font-medium text-ink">
            Lending Rules (One per line)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Keep in provided case&#10;No writing on pages"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            className="w-full bg-paper border border-line rounded-xl p-3 text-sm text-ink placeholder:text-muted/60 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none hover:border-indigo-300"
          />
        </div>

        <div className="pt-4 border-t border-line flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            List item now
          </Button>
        </div>
      </form>
    </Modal>
  );
};
