import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { filterAndSortItems } from '../lib/filters';
import { items } from '../data/items';
import { lenders } from '../data/users';
import { ItemCard } from '../components/items/ItemCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Filter, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Category, Campus, SortOption } from '../types';

export const ExploreView: React.FC = () => {
  const { filters, setFilters, itemsList } = useAppContext();
  const [sort, setSort] = useState<SortOption>('nearest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [displayedItemsCount, setDisplayedItemsCount] = useState(8);
  const [isLoadingShimmer, setIsLoadingShimmer] = useState(true);

  // Debounced search
  const [searchTerm, setSearchTerm] = useState(filters.searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: searchTerm }));
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, setFilters]);

  // Loading skeleton effect on filter/sort change
  useEffect(() => {
    setIsLoadingShimmer(true);
    const timer = setTimeout(() => {
      setIsLoadingShimmer(false);
    }, 380);
    return () => clearTimeout(timer);
  }, [filters, sort]);

  const filteredItems = filterAndSortItems(itemsList, filters, sort, lenders);
  const visibleItems = filteredItems.slice(0, displayedItemsCount);

  const campuses: Campus[] = [
    'Main Library',
    'Science Building',
    'Student Residence Hall',
    'Campus Sports Centre',
    'Engineering Block',
    'Student Union',
  ];

  const categories: { id: Category; label: string }[] = [
    { id: 'calculators', label: 'Calculators' },
    { id: 'lab-coats', label: 'Lab Coats' },
    { id: 'chargers', label: 'Chargers' },
    { id: 'books', label: 'Books' },
    { id: 'sports', label: 'Sports' },
    { id: 'tools', label: 'Tools' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'stationery', label: 'Stationery' },
    { id: 'umbrellas', label: 'Umbrellas' },
    { id: 'decor', label: 'Dorm Decor & Lights' },
  ];

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      campus: 'all',
      availableOnly: false,
      maxDuration: 120,
      freeOnly: false,
      minTrustScore: 0,
    });
    setSearchTerm('');
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    (filters.category && filters.category !== 'all') ||
    (filters.campus && filters.campus !== 'all') ||
    filters.availableOnly ||
    filters.freeOnly ||
    filters.maxDuration < 120 ||
    filters.minTrustScore > 0;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Live Results Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-line gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink tracking-tight">
              Explore Campus Listings
            </h1>
            <p className="text-muted text-sm mt-1">
              Find gear shared by verified students across all campus buildings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted tabular-nums">
              <span className="text-ink font-bold font-mono">{filteredItems.length}</span> items found
            </span>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden gap-1.5"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Search Bar & Primary Controls */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <Input
              placeholder="Search calculators, lab coats, chargers, books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} />}
              className="bg-paper"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-3">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              options={[
                { value: 'nearest', label: 'Sort: Nearest to me' },
                { value: 'recent', label: 'Sort: Recently added' },
                { value: 'rating', label: 'Sort: Highest rated' },
                { value: 'popularity', label: 'Sort: Most borrowed' },
              ]}
              className="bg-paper"
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-muted mr-1">Active filters:</span>

            {filters.category && filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
                <span>Category: {filters.category}</span>
                <button onClick={() => setFilters(p => ({ ...p, category: 'all' }))} className="hover:text-indigo-600">
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.campus && filters.campus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 border border-indigo-200">
                <span>Campus: {filters.campus}</span>
                <button onClick={() => setFilters(p => ({ ...p, campus: 'all' }))} className="hover:text-indigo-600">
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.availableOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-900 border border-teal-200">
                <span>Available now</span>
                <button onClick={() => setFilters(p => ({ ...p, availableOnly: false }))} className="hover:text-teal-600">
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.freeOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-900 border border-teal-200">
                <span>Free only</span>
                <button onClick={() => setFilters(p => ({ ...p, freeOnly: false }))} className="hover:text-teal-600">
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.minTrustScore > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                <span>Trust Score ≥ {filters.minTrustScore}</span>
                <button onClick={() => setFilters(p => ({ ...p, minTrustScore: 0 }))} className="hover:text-amber-600">
                  <X size={14} />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 ml-2"
            >
              <RotateCcw size={13} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Explore Main Grid with Filter Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 bg-paper rounded-3xl p-6 border border-line shadow-rest space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="font-heading font-bold text-ink text-base flex items-center gap-2">
                <Filter size={16} />
                <span>Filters</span>
              </h2>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-xs font-semibold text-indigo-600 hover:underline">
                  Reset
                </button>
              )}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-heading font-bold text-muted uppercase tracking-wider mb-2.5">
                Category
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setFilters(p => ({ ...p, category: 'all' }))}
                  className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    !filters.category || filters.category === 'all' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-muted hover:text-ink'
                  }`}
                >
                  All Categories ({items.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters(p => ({ ...p, category: cat.id }))}
                    className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      filters.category === cat.id ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Select */}
            <div>
              <label className="block text-xs font-heading font-bold text-muted uppercase tracking-wider mb-2.5">
                Campus Location
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <button
                  onClick={() => setFilters(p => ({ ...p, campus: 'all' }))}
                  className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    !filters.campus || filters.campus === 'all' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-muted hover:text-ink'
                  }`}
                >
                  All Campus Locations
                </button>
                {campuses.map(campus => (
                  <button
                    key={campus}
                    onClick={() => setFilters(p => ({ ...p, campus }))}
                    className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      filters.campus === campus ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {campus}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-2 border-t border-line space-y-3">
              <Checkbox
                checked={filters.availableOnly}
                onChange={(checked) => setFilters(p => ({ ...p, availableOnly: checked }))}
                label={<span className="text-xs font-semibold">Available now only</span>}
              />
              <Checkbox
                checked={filters.freeOnly}
                onChange={(checked) => setFilters(p => ({ ...p, freeOnly: checked }))}
                label={<span className="text-xs font-semibold">Free deposit items</span>}
              />
            </div>

            {/* Minimum Trust Score Range Slider */}
            <div className="pt-2 border-t border-line">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-muted">Min. Lender Trust Score</span>
                <span className="text-teal-700 font-mono font-bold">{filters.minTrustScore}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={filters.minTrustScore}
                onChange={(e) => setFilters(p => ({ ...p, minTrustScore: parseInt(e.target.value) }))}
                className="w-full accent-indigo-600 h-1.5 bg-line rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Results Grid (9 cols) */}
          <div className="lg:col-span-9">
            {isLoadingShimmer ? (
              /* Soft Shimmer Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-paper rounded-2xl border border-line p-4 space-y-3 shimmer-mask">
                    <div className="w-full aspect-[4/3] bg-line/60 rounded-xl"></div>
                    <div className="h-4 bg-line/80 rounded-md w-3/4"></div>
                    <div className="h-3 bg-line/50 rounded-md w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              /* Empty State */
              <div className="bg-paper rounded-3xl p-12 border border-line shadow-rest text-center">
                <EmptyState
                  title="No listings match your search"
                  description="Try adjusting your filters, clearing the search keyword, or expanding your campus distance."
                  action={
                    <Button onClick={clearAllFilters} className="mt-4">
                      Clear all filters
                    </Button>
                  }
                />
              </div>
            ) : (
              /* Populated Grid with Staggered Fade */
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-280">
                  {visibleItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleItems.length < filteredItems.length && (
                  <div className="text-center pt-4">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setDisplayedItemsCount(prev => prev + 6)}
                    >
                      Load more items ({filteredItems.length - visibleItems.length} remaining)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Bottom Sheet */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-3xl p-6 shadow-float border-t border-line max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-heading font-bold text-lg text-ink">Filter Listings</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1 rounded-lg text-muted">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Select
                label="Category"
                value={filters.category || 'all'}
                onChange={(e) => setFilters(p => ({ ...p, category: e.target.value as Category | 'all' }))}
                options={[{ value: 'all', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.label }))]}
              />

              <Select
                label="Campus Location"
                value={filters.campus || 'all'}
                onChange={(e) => setFilters(p => ({ ...p, campus: e.target.value as Campus | 'all' }))}
                options={[{ value: 'all', label: 'All Campus Locations' }, ...campuses.map(c => ({ value: c, label: c }))]}
              />

              <div className="pt-2 border-t border-line space-y-3">
                <Checkbox
                  checked={filters.availableOnly}
                  onChange={(checked) => setFilters(p => ({ ...p, availableOnly: checked }))}
                  label={<span className="text-sm font-semibold">Available now only</span>}
                />
                <Checkbox
                  checked={filters.freeOnly}
                  onChange={(checked) => setFilters(p => ({ ...p, freeOnly: checked }))}
                  label={<span className="text-sm font-semibold">Free deposit items only</span>}
                />
              </div>
            </div>

            <Button className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
