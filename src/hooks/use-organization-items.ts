import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionArgs, FunctionReturnType } from 'convex/server';

type CreateItemData = FunctionArgs<typeof api.functions.items.mutations.create>['data'];
type UpdateItemData = FunctionArgs<typeof api.functions.items.mutations.update>['data'];
type ItemsResult = FunctionReturnType<typeof api.functions.items.queries.listByOrganization> | undefined;

interface OrganizationItemsResult {
  items: NonNullable<ItemsResult>;
  isLoading: boolean;
  createItem: (data: CreateItemData) => Promise<Id<'items'>>;
  updateItem: (id: Id<'items'>, data: UpdateItemData) => Promise<FunctionReturnType<typeof api.functions.items.mutations.update>>;
  deleteItem: (id: Id<'items'>) => Promise<FunctionReturnType<typeof api.functions.items.mutations.remove>>;
}

function requireOrganizationId(organizationId: string | null | undefined): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }
  return organizationId;
}

export function useOrganizationItems(
  organizationId: string | null | undefined
): OrganizationItemsResult {
  const items = useQuery(
    api.functions.items.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip'
  );
  const create = useMutation(api.functions.items.mutations.create);
  const update = useMutation(api.functions.items.mutations.update);
  const remove = useMutation(api.functions.items.mutations.remove);
  const getScopedOrganizationId = (): string => requireOrganizationId(organizationId);
  const createItem = (data: CreateItemData): Promise<Id<'items'>> => create({
    organizationId: getScopedOrganizationId(),
    data,
  });
  const updateItem = (
    id: Id<'items'>,
    data: UpdateItemData
  ): Promise<FunctionReturnType<typeof api.functions.items.mutations.update>> => (
    update({ id, organizationId: getScopedOrganizationId(), data })
  );
  const deleteItem = (
    id: Id<'items'>
  ): Promise<FunctionReturnType<typeof api.functions.items.mutations.remove>> => (
    remove({ id, organizationId: getScopedOrganizationId() })
  );

  return {
    items: items ?? [],
    isLoading: items === undefined || organizationId === null,
    createItem,
    updateItem,
    deleteItem,
  };
}
