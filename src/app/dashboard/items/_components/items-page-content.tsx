'use client';

import { Download, Plus } from 'lucide-react';

import { ItemForm } from './ItemForm';
import { itemColumns, priorityFilter, statusFilter } from './item-config';
import { useItemsPage } from './use-items-page';

import { ResponsiveButton } from '@/components/layout';
import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet';
import { SmartTable } from '@/components/shared/SmartTable';
import { TableToolbar } from '@/components/shared/TableToolbar';

export function ItemsPageContent(): React.ReactElement {
  const page = useItemsPage();

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] flex-col gap-6 md:h-[calc(100vh-theme(spacing.12))]">
      <div className="flex shrink-0 items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Items</h1>
        <div className="flex gap-2">
          <ResponsiveButton variant="outline" desktopLabel="Export" mobileLabel="Export" icon={<Download className="size-4" />} onClick={page.handleDownload} />
          <ResponsiveButton desktopLabel="New Item" mobileLabel="New" icon={<Plus className="size-4" />} onClick={page.handleCreate} />
        </div>
      </div>
      <TableToolbar
        search={{ value: page.search, onChange: page.setSearch, placeholder: 'Search items...' }}
        filters={[
          { config: statusFilter, value: page.filters.status ?? 'all', onChange: (value): void => { page.setFilter('status', value); } },
          { config: priorityFilter, value: page.filters.priority ?? 'all', onChange: (value): void => { page.setFilter('priority', value); } },
        ]}
        onClearAll={page.clearAll}
      />
      <SmartTable
        data={page.paginatedData}
        columns={itemColumns}
        isLoading={page.isLoading}
        actions={['edit', 'delete']}
        actionHandlers={page.actionHandlers}
        noDataMessage={page.search || page.filters.status || page.filters.priority ? 'No matching items' : 'No items found'}
        stickyHeader
        fullHeight
        pagination={{ currentPage: page.pagination.currentPage, totalPages: page.pagination.totalPages, totalItems: page.pagination.totalItems, pageSize: page.pagination.pageSize, startIndex: page.pagination.startIndex, endIndex: page.pagination.endIndex, onPageChange: page.pagination.goToPage }}
      />
      <ResponsiveSheet open={page.isSheetOpen} onOpenChange={page.setIsSheetOpen} title={page.editingItem ? 'Edit Item' : 'New Item'}>
        <ItemForm defaultValues={page.editingItem ?? undefined} onSubmit={(data): void => { void page.handleSubmit(data); }} onCancel={page.handleCancel} />
      </ResponsiveSheet>
    </div>
  );
}
