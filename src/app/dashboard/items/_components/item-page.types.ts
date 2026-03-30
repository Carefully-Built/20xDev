import type { ActionHandlers } from '@/components/shared/SmartTable';
import type { usePagination } from '@/hooks/use-pagination';

import type { ItemFormValues } from './ItemForm';
import type { ItemRow } from './item-config';

export interface UseItemsPageResult {
  actionHandlers: ActionHandlers<ItemRow>;
  editingItem: ItemRow | null;
  filters: Record<string, string | undefined>;
  handleCancel: () => void;
  handleCreate: () => void;
  handleDownload: () => void;
  handleSubmit: (data: ItemFormValues) => Promise<void>;
  isLoading: boolean;
  isSheetOpen: boolean;
  paginatedData: ItemRow[];
  pagination: ReturnType<typeof usePagination>;
  search: string;
  setFilter: (key: string, value: string) => void;
  setIsSheetOpen: (open: boolean) => void;
  setSearch: (value: string) => void;
  clearAll: () => void;
}
