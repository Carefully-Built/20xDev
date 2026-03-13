'use client';

import { T } from 'gt-next';
import { Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ItemForm } from './_components/ItemForm';

import type { ActionHandlers, Column } from '@/components/shared/SmartTable';
import type { Id } from '@convex/_generated/dataModel';

import { ResponsiveButton } from '@/components/layout';
import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet';
import { SmartTable } from '@/components/shared/SmartTable';
import { TableToolbar, useTableFilters, type FilterConfig } from '@/components/shared/TableToolbar';
import {
  useCreateItem,
  useDeleteItem,
  useItemsByOrganization,
  useUpdateItem,
} from '@/hooks/use-items';
import { usePagination } from '@/hooks/use-pagination';
import { useUsersByOrganization } from '@/hooks/use-users';
import { exportToCsv, tableColumnsToCsv } from '@/lib/csv-export';
import {
  ITEM_STATUS_CONFIG,
  ITEM_STATUS_OPTIONS,
  ITEM_PRIORITY_CONFIG,
  ITEM_PRIORITY_OPTIONS,
  type ItemStatus,
  type ItemPriority,
} from '@/lib/filters';
import { useOrganization } from '@/providers';

interface Item {
  _id: Id<'items'>;
  name: string;
  description?: string;
  status: ItemStatus;
  priority: ItemPriority;
  createdAt: number;
}

// Filter configs - reusable for any table with these fields
const STATUS_FILTER: FilterConfig<ItemStatus> = {
  key: 'status',
  label: 'Status',
  options: ITEM_STATUS_OPTIONS,
};

const PRIORITY_FILTER: FilterConfig<ItemPriority> = {
  key: 'priority',
  label: 'Priority',
  options: ITEM_PRIORITY_OPTIONS,
};

const columns: Column<Item>[] = [
  { header: 'Name', accessor: 'name', width: '30%' },
  { header: 'Description', accessor: 'description', hideOnMobile: true },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => {
      const config = ITEM_STATUS_CONFIG[value as ItemStatus];
      return (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${config?.bgColor ?? ''}`}>
          {config?.label ?? String(value)}
        </span>
      );
    },
  },
  {
    header: 'Priority',
    accessor: 'priority',
    hideOnMobile: true,
    render: (value) => {
      const config = ITEM_PRIORITY_CONFIG[value as ItemPriority];
      return (
        <span className={`font-medium ${config?.color ?? ''}`}>
          {config?.label ?? String(value)}
        </span>
      );
    },
  },
];

export default function ItemsPage(): React.ReactElement {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { organizationId } = useOrganization();
  
  // Convex queries and mutations
  const items = useItemsByOrganization(organizationId);
  const users = useUsersByOrganization(organizationId);
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const isLoading = items === undefined || organizationId === null;

  // Filtering
  const {
    filteredData,
    search,
    setSearch,
    filters,
    setFilter,
    clearAll,
  } = useTableFilters({
    data: items ?? [],
    searchFields: ['name', 'description'],
    filterKeys: ['status', 'priority'],
  });

  // Pagination
  const pagination = usePagination({
    totalItems: filteredData.length,
    pageSize: 20,
  });

  // Get paginated data
  const paginatedData = pagination.paginate(filteredData);
  
  // Get the first user as fallback (the one who just signed in)
  // In production, you'd want proper user context from server components
  const currentUser = users?.[0];

  const actionHandlers: ActionHandlers<Item> = {
    onEdit: (item) => {
      setEditingItem(item);
      setIsSheetOpen(true);
    },
    onDelete: (item) => {
      toast.error(`Delete "${item.name}"?`, {
        action: {
          label: 'Confirm',
          onClick: () => {
            void deleteItem({ id: item._id }).then(() => {
              toast.success(`"${item.name}" deleted`);
            });
          },
        },
      });
    },
  };

  const handleCreate = (): void => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const handleDownload = (): void => {
    if (!filteredData.length) {
      toast.error('No items to export');
      return;
    }
    
    const csvColumns = tableColumnsToCsv(columns);
    exportToCsv(filteredData, csvColumns, 'items.csv', {
      formatDate: (d) => new Date(d).toLocaleDateString(),
    });
    toast.success(`Exported ${filteredData.length} items`);
  };

  const handleSubmit = async (data: { 
    name: string; 
    description?: string; 
    status: 'draft' | 'active' | 'archived'; 
    priority: 'low' | 'medium' | 'high';
  }): Promise<void> => {
    try {
      if (editingItem) {
        await updateItem({ 
          id: editingItem._id, 
          data: {
            name: data.name,
            description: data.description,
            status: data.status,
            priority: data.priority,
          }
        });
        toast.success('Item updated');
      } else {
        if (!currentUser?._id) {
          toast.error('No user found. Please sign out and sign back in.');
          return;
        }
        if (!organizationId) {
          toast.error('No organization selected.');
          return;
        }
        await createItem({ 
          data: {
            name: data.name,
            description: data.description,
            status: data.status,
            priority: data.priority,
            organizationId,
          },
          createdBy: currentUser._id,
        });
        toast.success('Item created');
      }
      setIsSheetOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    }
  };

  const handleCancel = (): void => {
    setIsSheetOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] md:h-[calc(100vh-theme(spacing.12))] flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-semibold tracking-tight"><T>Items</T></h1>
        <div className="flex gap-2">
          <ResponsiveButton
            variant="outline"
            desktopLabel={<T>Export</T>}
            mobileLabel={<T>Export</T>}
            icon={<Download className="size-4" />}
            onClick={handleDownload}
          />
          <ResponsiveButton
            desktopLabel={<T>New Item</T>}
            mobileLabel={<T>New</T>}
            icon={<Plus className="size-4" />}
            onClick={handleCreate}
          />
        </div>
      </div>

      <div className="shrink-0">
        <TableToolbar
          search={{
            value: search,
            onChange: setSearch,
            placeholder: 'Search items...',
          }}
          filters={[
            {
              config: STATUS_FILTER,
              value: filters.status ?? 'all',
              onChange: (v) => { setFilter('status', v); },
            },
            {
              config: PRIORITY_FILTER,
              value: filters.priority ?? 'all',
              onChange: (v) => { setFilter('priority', v); },
            },
          ]}
          onClearAll={clearAll}
        />
      </div>

      <SmartTable
        data={paginatedData}
        columns={columns}
        isLoading={isLoading}
        actions={['edit', 'delete']}
        actionHandlers={actionHandlers}
        noDataMessage={search || filters.status || filters.priority ? 'No matching items' : 'No items found'}
        stickyHeader
        fullHeight
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          pageSize: pagination.pageSize,
          startIndex: pagination.startIndex,
          endIndex: pagination.endIndex,
          onPageChange: pagination.goToPage,
        }}
      />

      <ResponsiveSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={editingItem ? <T>Edit Item</T> : <T>New Item</T>}
      >
        <ItemForm
          defaultValues={editingItem ?? undefined}
          onSubmit={(data) => void handleSubmit(data)}
          onCancel={handleCancel}
        />
      </ResponsiveSheet>
    </div>
  );
}
