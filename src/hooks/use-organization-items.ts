import { useCreateItem, useDeleteItem, useUpdateItem } from './use-item-mutations';
import { useItemsByOrganization } from './use-items';

import type { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type { FunctionArgs, FunctionReturnType } from 'convex/server';

type CreateItemData = FunctionArgs<typeof api.functions.items.mutations.create>['data'];
type UpdateItemData = FunctionArgs<typeof api.functions.items.mutations.update>['data'];
type ItemsResult = FunctionReturnType<
  typeof api.functions.items.queries.listByOrganization
> | undefined;

interface OrganizationItemsResult {
  items: NonNullable<ItemsResult>;
  isLoading: boolean;
  createItem: (data: CreateItemData) => Promise<Id<'items'>>;
  updateItem: (id: Id<'items'>, data: UpdateItemData) => Promise<FunctionReturnType<typeof api.functions.items.mutations.update>>;
  deleteItem: (id: Id<'items'>) => Promise<FunctionReturnType<typeof api.functions.items.mutations.remove>>;
}

export function useOrganizationItems(
  organizationId: string | null | undefined
): OrganizationItemsResult {
  const queryResult = useItemsByOrganization(organizationId);
  const createItem = useCreateItem(organizationId);
  const updateItem = useUpdateItem(organizationId);
  const deleteItem = useDeleteItem(organizationId);

  return {
    items: queryResult ?? [],
    isLoading: Boolean(organizationId) && queryResult === undefined,
    createItem,
    updateItem,
    deleteItem,
  };
}
