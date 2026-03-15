'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';

import { formatValue, getNestedValue } from './utils';

import type { ActionHandlers, ActionType, Column, PaginationConfig } from './types';
import type { ReactNode } from 'react';

import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DesktopViewProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  skeletonRows: number;
  actions?: ActionType[];
  actionHandlers?: ActionHandlers<T>;
  renderActions?: (item: T) => ReactNode;
  noDataMessage: string;
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  pagination?: PaginationConfig;
  stickyHeader?: boolean;
  maxHeight?: string;
  fullHeight?: boolean;
}

const ActionIcons: Record<ActionType, typeof Eye> = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
};

export function DesktopView<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading,
  skeletonRows,
  actions,
  actionHandlers,
  renderActions,
  noDataMessage,
  getRowKey,
  onRowClick,
  pagination,
  stickyHeader = false,
  maxHeight = 'calc(100vh - 300px)',
  fullHeight = false,
}: DesktopViewProps<T>): React.ReactElement {
  const hasActions = (actions?.length ?? 0) > 0 || renderActions !== undefined;

  const renderCellValue = (column: Column<T>, item: T): ReactNode => {
    const value = column.accessor
      ? typeof column.accessor === 'string' && column.accessor.includes('.')
        ? getNestedValue(item, column.accessor)
        : (item as Record<string, unknown>)[column.accessor as string]
      : null;

    if (column.render) {
      return column.render(value, item);
    }

    return formatValue(value);
  };

  const renderActionButtons = (item: T): ReactNode => {
    if (renderActions) {
      return renderActions(item);
    }

    if (!actions || !actionHandlers) {
      return null;
    }

    return (
      <div className="flex items-center gap-1">
        {actions.map((action) => {
          const Icon = ActionIcons[action];
          const handler =
            action === 'view'
              ? actionHandlers.onView
              : action === 'edit'
                ? actionHandlers.onEdit
                : actionHandlers.onDelete;
          
          return (
            <Button
              key={action}
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => {
                e.stopPropagation();
                handler?.(item);
              }}
            >
              <Icon className="size-4" />
            </Button>
          );
        })}
      </div>
    );
  };

  const tableHeader = (
    <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10 bg-muted/50 backdrop-blur-sm')}>
      <TableRow>
        {columns.map((col) => (
          <TableHead
            key={col.header}
            style={{ width: col.width }}
            className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
          >
            {col.header}
          </TableHead>
        ))}
        {hasActions ? <TableHead className="w-24">Actions</TableHead> : null}
      </TableRow>
    </TableHeader>
  );

  // Determine scrollable container styles
  const scrollContainerClass = cn(
    'rounded-lg border overflow-hidden',
    fullHeight && 'flex-1 min-h-0 overflow-auto',
    !fullHeight && stickyHeader && 'overflow-auto'
  );
  const scrollContainerStyle = !fullHeight && stickyHeader ? { maxHeight } : undefined;

  if (isLoading) {
    return (
      <div className={cn('flex flex-col', fullHeight && 'flex-1 min-h-0')}>
        <div className={scrollContainerClass} style={scrollContainerStyle}>
          <Table>
            {tableHeader}
            <TableBody>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.header}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                  {hasActions ? (
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('flex flex-col', fullHeight && 'flex-1 min-h-0')}>
        <div className={cn('flex items-center justify-center text-muted-foreground', fullHeight ? 'flex-1' : 'h-32')}>
          {noDataMessage}
        </div>
        {pagination && pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', fullHeight && 'flex-1 min-h-0')}>
      <div className={scrollContainerClass} style={scrollContainerStyle}>
        <Table>
          {tableHeader}
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={getRowKey(item)}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.header}
                    className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                  >
                    {renderCellValue(col, item)}
                  </TableCell>
                ))}
                {hasActions ? (
                  <TableCell>{renderActionButtons(item)}</TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
