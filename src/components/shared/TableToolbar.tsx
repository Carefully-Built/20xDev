'use client';

import { Filter, Search, X } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FilterOption } from '@/lib/filters';

// ============================================================
// FILTER DROPDOWN
// ============================================================

interface FilterDropdownProps<T extends string> {
  readonly label: string;
  readonly value: T | 'all';
  readonly options: readonly FilterOption[];
  readonly onChange: (value: T | 'all') => void;
  readonly className?: string;
}

export function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: FilterDropdownProps): React.ReactElement {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T | 'all')}>
      <SelectTrigger className={className ?? 'w-full sm:w-[140px]'}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================================
// SEARCH INPUT
// ============================================================

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps): React.ReactElement {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================
// TABLE TOOLBAR
// ============================================================

export interface FilterConfig<T extends string = string> {
  readonly key: string;
  readonly label: string;
  readonly options: readonly FilterOption[];
}

export interface TableToolbarProps {
  readonly search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  readonly filters?: {
    config: FilterConfig<string>;
    value: string;
    onChange: (value: string) => void;
  }[];
  readonly onClearAll?: () => void;
  readonly children?: React.ReactNode;
}

export function TableToolbar({
  search,
  filters,
  onClearAll,
  children,
}: TableToolbarProps): React.ReactElement {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasActiveFilters =
    (search?.value && search.value.length > 0) ||
    filters?.some((f) => f.value !== 'all');

  const activeFilterCount = filters?.filter((f) => f.value !== 'all').length ?? 0;

  return (
    <div className="space-y-3">
      {/* Main row: Search + Filter button (mobile) / Search + Filters inline (desktop) */}
      <div className="flex items-center gap-2">
        {search && (
          <SearchInput
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
            className="flex-1 sm:flex-initial sm:w-64"
          />
        )}

        {/* Mobile: Filter toggle button */}
        {filters && filters.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden relative"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="size-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}

        {/* Desktop: Inline filters */}
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          {filters?.map((filter) => (
            <FilterDropdown
              key={filter.config.key}
              label={filter.config.label}
              value={filter.value}
              options={filter.config.options}
              onChange={filter.onChange}
            />
          ))}
          {hasActiveFilters && onClearAll && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 px-2">
              <X className="mr-1 size-4" />
              Clear
            </Button>
          )}
        </div>

        {children && <div className="hidden sm:flex sm:items-center sm:gap-2 sm:ml-auto">{children}</div>}
      </div>

      {/* Mobile: Expandable filters */}
      {filters && filters.length > 0 && (
        <div
          className={cn(
            'grid transition-all duration-200 ease-in-out sm:hidden',
            filtersOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-2 pt-1">
              {filters.map((filter) => (
                <div key={filter.config.key} className="flex items-center gap-2">
                  <span className="w-20 text-sm text-muted-foreground">{filter.config.label}</span>
                  <FilterDropdown
                    label={filter.config.label}
                    value={filter.value}
                    options={filter.config.options}
                    onChange={filter.onChange}
                    className="flex-1"
                  />
                </div>
              ))}
              {hasActiveFilters && onClearAll && (
                <Button variant="outline" size="sm" onClick={onClearAll} className="w-full">
                  <X className="mr-1 size-4" />
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// USE TABLE FILTERS HOOK (with nuqs)
// ============================================================

export interface UseTableFiltersOptions {
  readonly data: T[];
  readonly searchFields?: (keyof T)[];
  readonly filterKeys?: (keyof T)[];
}

export interface UseTableFiltersReturn {
  readonly filteredData: T[];
  readonly search: string;
  readonly setSearch: (value: string) => void;
  readonly filters: Record<string, string>;
  readonly setFilter: (key: string, value: string) => void;
  readonly clearAll: () => void;
}

export function useTableFilters<T extends Record<string, unknown>>({
  data,
  searchFields = [],
  filterKeys = [],
}: UseTableFiltersOptions): UseTableFiltersReturn {
  // Use nuqs for URL state
  const [search, setSearchRaw] = useQueryState('q', parseAsString.withDefault(''));
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault('all'));
  const [priorityFilter, setPriorityFilter] = useQueryState('priority', parseAsString.withDefault('all'));

  // Build filters object from URL state
  const filters: Record<string, string> = {
    status: statusFilter,
    priority: priorityFilter,
  };

  const setSearch = useCallback((value: string) => {
    void setSearchRaw(value || null);
  }, [setSearchRaw]);

  const setFilter = useCallback((key: string, value: string) => {
    if (key === 'status') {
      void setStatusFilter(value === 'all' ? null : value);
    } else if (key === 'priority') {
      void setPriorityFilter(value === 'all' ? null : value);
    }
  }, [setStatusFilter, setPriorityFilter]);

  const clearAll = useCallback(() => {
    void setSearchRaw(null);
    void setStatusFilter(null);
    void setPriorityFilter(null);
  }, [setSearchRaw, setStatusFilter, setPriorityFilter]);

  const filteredData = data.filter((item) => {
    // Search filter
    if (search && searchFields.length > 0) {
      const searchLower = search.toLowerCase();
      const matchesSearch = searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
      if (!matchesSearch) return false;
    }

    // Field filters
    for (const key of filterKeys) {
      const filterValue = filters[String(key)];
      if (filterValue && filterValue !== 'all') {
        if (item[key] !== filterValue) return false;
      }
    }

    return true;
  });

  return {
    filteredData,
    search,
    setSearch,
    filters,
    setFilter,
    clearAll,
  };
}
