'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Start index of current page items (1-indexed for display) */
  startIndex: number;
  /** End index of current page items */
  endIndex: number;
  /** Go to specific page */
  onPageChange: (page: number) => void;
  /** Optional: page size options */
  pageSizeOptions?: number[];
  /** Optional: callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Optional: custom className */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  className,
}: PaginationProps): React.ReactElement {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className={cn('flex items-center justify-between gap-3 py-3', className)}>
      {/* Items info */}
      <div className="text-xs text-muted-foreground">
        {totalItems === 0 ? (
          'No items'
        ) : (
          <>
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{totalItems}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Page size selector */}
        {pageSizeOptions && onPageSizeChange && (
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="text-xs text-muted-foreground">Rows:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => { onPageSizeChange(Number(v)); }}
            >
              <SelectTrigger className="h-7 w-[60px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page info */}
        <div className="hidden text-xs text-muted-foreground sm:block">
          Page {currentPage} of {totalPages}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(1); }}
            disabled={!hasPrevPage}
          >
            <ChevronsLeft className="size-3.5" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(currentPage - 1); }}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="size-3.5" />
            <span className="sr-only">Previous page</span>
          </Button>

          {/* Mobile page indicator */}
          <span className="px-1.5 text-xs sm:hidden">
            {currentPage}/{totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(currentPage + 1); }}
            disabled={!hasNextPage}
          >
            <ChevronRight className="size-3.5" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => { onPageChange(totalPages); }}
            disabled={!hasNextPage}
          >
            <ChevronsRight className="size-3.5" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
