import { Item, FilterState, SortOption, Lender } from '../types';
import { isAvailableNow } from './format';

export const filterAndSortItems = (
  items: Item[],
  filters: FilterState,
  sort: SortOption,
  lenders: Lender[] | Record<string, Lender>
): Item[] => {
  let result = [...items];

  // Helper to find lender
  const getLender = (lenderId: string): Lender | undefined => {
    if (Array.isArray(lenders)) {
      return lenders.find(l => l.id === lenderId);
    }
    return lenders[lenderId];
  };

  // Search Query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.campus.toLowerCase().includes(q)
    );
  }

  // Category
  if (filters.category && filters.category !== 'all') {
    result = result.filter(item => item.category === filters.category);
  }

  // Campus
  if (filters.campus && filters.campus !== 'all') {
    result = result.filter(item => item.campus === filters.campus);
  }

  // Available Now
  if (filters.availableOnly) {
    result = result.filter(item => item.available && isAvailableNow(item.availableFrom));
  }

  // Max Duration
  if (filters.maxDuration && filters.maxDuration < 120) {
    result = result.filter(item => item.maxDurationDays <= filters.maxDuration);
  }

  // Free only
  if (filters.freeOnly) {
    result = result.filter(item => item.depositEuros === 0);
  }

  // Min Trust Score
  if (filters.minTrustScore > 0) {
    result = result.filter(item => {
      const lender = getLender(item.lenderId);
      return lender ? lender.trustScore >= filters.minTrustScore : true;
    });
  }

  // Sorting
  switch (sort) {
    case 'nearest':
      result.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case 'recent':
      result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      break;
    case 'rating':
    case 'highest-rated':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
    case 'popular':
      result.sort((a, b) => b.borrowCount - a.borrowCount);
      break;
  }

  return result;
};
