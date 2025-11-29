import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SortOption = 'price-asc' | 'price-desc' | 'volume-24h' | 'volume-7d' | 'sales' | 'recent';
type Blockchain = 'all' | 'ethereum' | 'polygon' | 'solana' | 'bitcoin';
type TimeRange = '24h' | '7d' | '30d' | 'all';
type OwnerDistribution = 'all' | 'distributed' | 'whale-heavy';

const sortOptions = [
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'volume-24h', label: 'Volume (24h)' },
  { id: 'volume-7d', label: 'Volume (7d)' },
  { id: 'sales', label: 'Most Sales' },
  { id: 'recent', label: 'Recently Listed' },
];

const blockchains = [
  { id: 'all', label: 'All Chains' },
  { id: 'ethereum', label: 'Ethereum', color: '#627EEA' },
  { id: 'polygon', label: 'Polygon', color: '#8247E5' },
  { id: 'solana', label: 'Solana', color: '#14F195' },
  { id: 'bitcoin', label: 'Bitcoin', color: '#F7931A' },
];

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: 'all', label: 'All' },
];

export interface FilterState {
  blockchain: Blockchain;
  sort: SortOption;
  timeRange: TimeRange;
  ownerDistribution: OwnerDistribution;
  priceMin?: number;
  priceMax?: number;
  volumeChange?: 'increasing' | 'decreasing' | null;
}

interface FilterSectionProps {
  onFilterChange?: (filters: FilterState) => void;
}

export function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    blockchain: 'all',
    sort: 'volume-24h',
    timeRange: '24h',
    ownerDistribution: 'all',
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = { 
      blockchain: 'all', 
      sort: 'volume-24h',
      timeRange: '24h',
      ownerDistribution: 'all',
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const hasActiveFilters = filters.blockchain !== 'all' || 
    filters.priceMin || 
    filters.priceMax || 
    filters.volumeChange ||
    filters.timeRange !== '24h' ||
    filters.ownerDistribution !== 'all';

  const activeFilterCount = [
    filters.blockchain !== 'all', 
    filters.priceMin, 
    filters.priceMax, 
    filters.volumeChange,
    filters.timeRange !== '24h',
    filters.ownerDistribution !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="mb-8">
      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          variant={isOpen ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Blockchain Quick Select */}
        <div className="flex gap-1">
          {blockchains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => updateFilter('blockchain', chain.id as Blockchain)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filters.blockchain === chain.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
              style={
                filters.blockchain === chain.id && chain.color
                  ? { backgroundColor: chain.color, color: '#fff' }
                  : undefined
              }
            >
              {chain.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative ml-auto">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
            className="appearance-none bg-muted text-foreground px-4 py-1.5 pr-8 rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters Panel */}
      {isOpen && (
        <div className="glass rounded-xl p-6 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ''}
                  onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ''}
                  onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Volume Change */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Volume Change
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateFilter('volumeChange', filters.volumeChange === 'increasing' ? null : 'increasing')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    filters.volumeChange === 'increasing'
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  📈 Increasing
                </button>
                <button
                  onClick={() => updateFilter('volumeChange', filters.volumeChange === 'decreasing' ? null : 'decreasing')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    filters.volumeChange === 'decreasing'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  📉 Decreasing
                </button>
              </div>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Time Range
              </label>
              <div className="flex gap-1">
                {timeRanges.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => updateFilter('timeRange', period.id)}
                    className={cn(
                      'flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all',
                      filters.timeRange === period.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    )}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Owner Distribution */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Owner Distribution
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateFilter('ownerDistribution', filters.ownerDistribution === 'distributed' ? 'all' : 'distributed')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    filters.ownerDistribution === 'distributed'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  Distributed
                </button>
                <button
                  onClick={() => updateFilter('ownerDistribution', filters.ownerDistribution === 'whale-heavy' ? 'all' : 'whale-heavy')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    filters.ownerDistribution === 'whale-heavy'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  Whale-heavy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
