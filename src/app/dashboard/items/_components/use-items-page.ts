'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { UseItemsPageResult } from './item-page.types';
import { itemColumns, type ItemRow } from './item-config';
import type { ItemFormValues } from './ItemForm';

import type { ActionHandlers } from '@/components/shared/SmartTable';

import { useTableFilters } from '@/components/shared/TableToolbar';
import { useOrganizationItems } from '@/hooks/use-organization-items';
import { usePagination } from '@/hooks/use-pagination';
import { exportToCsv, tableColumnsToCsv } from '@/lib/csv-export';
import { useOrganization } from '@/providers';

export function useItemsPage(): UseItemsPageResult {
  const [editingItem, setEditingItem] = useState<ItemRow | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { organizationId } = useOrganization();
  const { items, isLoading, createItem, updateItem, deleteItem } = useOrganizationItems(organizationId);
  const itemRows: ItemRow[] = items;
  const { filteredData, search, setSearch, filters, setFilter, clearAll } = useTableFilters({
    data: itemRows,
    searchFields: ['name', 'description'],
    filterKeys: ['status', 'priority'],
  });
  const pagination = usePagination({ totalItems: filteredData.length, pageSize: 20 });
  const paginatedData = pagination.paginate(filteredData);

  const actionHandlers: ActionHandlers<ItemRow> = {
    onEdit: (item): void => {
      setEditingItem(item);
      setIsSheetOpen(true);
    },
    onDelete: (item): void => {
      if (!organizationId) {
        toast.error('No organization selected.');
        return;
      }
      toast.error(`Delete "${item.name}"?`, {
        action: { label: 'Confirm', onClick: (): void => void deleteItem(item._id).then(() => toast.success(`"${item.name}" deleted`)) },
      });
    },
  };

  const handleCreate = (): void => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };
  const handleCancel = (): void => {
    setIsSheetOpen(false);
    setEditingItem(null);
  };
  const handleDownload = (): void => {
    if (!filteredData.length) {
      toast.error('No items to export');
      return;
    }
    exportToCsv(filteredData, tableColumnsToCsv(itemColumns), 'items.csv', {
      formatDate: (date): string => new Date(date).toLocaleDateString(),
    });
    toast.success(`Exported ${String(filteredData.length)} items`);
  };
  const handleSubmit = async (data: ItemFormValues): Promise<void> => {
    if (editingItem) await updateItem(editingItem._id, data);
    else await createItem(data);
    toast.success(editingItem ? 'Item updated' : 'Item created');
    handleCancel();
  };

  return {
    actionHandlers,
    clearAll,
    editingItem,
    filters,
    handleCancel,
    handleCreate,
    handleDownload,
    handleSubmit,
    isLoading,
    isSheetOpen,
    paginatedData,
    pagination,
    search,
    setFilter,
    setIsSheetOpen,
    setSearch,
  };
}
