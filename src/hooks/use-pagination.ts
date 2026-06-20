import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo, useCallback } from 'react';

export interface UsePaginationOptions {
  /** Total number of items */
  totalItems: number;
  /** Items per page (default: 20) */
  pageSize?: number;
  /** URL param name for page (default: 'page') */
  pageParam?: string;
}

export interface UsePaginationReturn {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Start index for slicing data (0-indexed) */
  startIndex: number;
  /** End index for slicing data (exclusive) */
  endIndex: number;
  /** Whether there's a previous page */
  hasPrevPage: boolean;
  /** Whether there's a next page */
  hasNextPage: boolean;
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Paginate data array */
  paginate: <T>(data: T[]) => T[];
}

export function usePagination({
  totalItems,
  pageSize = 20,
  pageParam = 'page',
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useQueryState(
    pageParam,
    parseAsInteger.withDefault(1)
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Ensure current page is within bounds
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.min(Math.max(1, newPage), totalPages);
      setPage(validPage === 1 ? null : validPage).catch((error: unknown) => {
        console.error('Unable to update pagination state:', error);
      });
    },
    [totalPages, setPage]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const paginate = useCallback(
    <T,>(data: T[]): T[] => {
      return data.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  return useMemo(
    () => ({
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      startIndex,
      endIndex,
      hasPrevPage,
      hasNextPage,
      goToPage,
      nextPage,
      prevPage,
      firstPage,
      lastPage,
      paginate,
    }),
    [
      currentPage,
      pageSize,
      totalPages,
      totalItems,
      startIndex,
      endIndex,
      hasPrevPage,
      hasNextPage,
      goToPage,
      nextPage,
      prevPage,
      firstPage,
      lastPage,
      paginate,
    ]
  );
}
