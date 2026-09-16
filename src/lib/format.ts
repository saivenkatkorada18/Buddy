const FIXED_TODAY = new Date('2026-09-16T12:00:00Z');

export const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const diffTime = Math.abs(date.getTime() - FIXED_TODAY.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (date.toDateString() === FIXED_TODAY.toDateString()) {
    return 'Today';
  } else if (diffDays === 1) {
    return date > FIXED_TODAY ? 'Tomorrow' : 'Yesterday';
  } else if (diffDays < 7 && date < FIXED_TODAY) {
    return `${diffDays} days ago`;
  } else if (diffDays < 7 && date > FIXED_TODAY) {
    return `In ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};

export const isAvailableNow = (availableFrom: string): boolean => {
  const date = new Date(availableFrom);
  return date <= FIXED_TODAY;
};
