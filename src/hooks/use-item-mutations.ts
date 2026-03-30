import { api } from '@convex/_generated/api';
import { useMutation } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionArgs, FunctionReturnType } from 'convex/server';

type CreateItemData = FunctionArgs<typeof api.functions.items.mutations.create>['data'];
type UpdateItemData = FunctionArgs<typeof api.functions.items.mutations.update>['data'];
type UpdateItemResult = FunctionReturnType<typeof api.functions.items.mutations.update>;
type UpdateStatusResult = FunctionReturnType<typeof api.functions.items.mutations.updateStatus>;
type AssignItemResult = FunctionReturnType<typeof api.functions.items.mutations.assign>;
type DeleteItemResult = FunctionReturnType<typeof api.functions.items.mutations.remove>;

function requireOrganizationId(organizationId: string | undefined | null): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }
  return organizationId;
}

export function useCreateItem(
  organizationId: string | undefined | null
): (data: CreateItemData) => Promise<Id<'items'>> {
  const create = useMutation(api.functions.items.mutations.create);
  return (data: CreateItemData): Promise<Id<'items'>> => create({ organizationId: requireOrganizationId(organizationId), data });
}

export function useUpdateItem(
  organizationId: string | undefined | null
): (id: Id<'items'>, data: UpdateItemData) => Promise<UpdateItemResult> {
  const update = useMutation(api.functions.items.mutations.update);
  return (id: Id<'items'>, data: UpdateItemData): Promise<UpdateItemResult> => update({ id, organizationId: requireOrganizationId(organizationId), data });
}

export function useUpdateItemStatus(
  organizationId: string | undefined | null
): (id: Id<'items'>, status: 'draft' | 'active' | 'archived') => Promise<UpdateStatusResult> {
  const updateStatus = useMutation(api.functions.items.mutations.updateStatus);
  return (id: Id<'items'>, status: 'draft' | 'active' | 'archived'): Promise<UpdateStatusResult> => updateStatus({ id, organizationId: requireOrganizationId(organizationId), status });
}

export function useAssignItem(
  organizationId: string | undefined | null
): (id: Id<'items'>, assignedTo?: Id<'users'>) => Promise<AssignItemResult> {
  const assign = useMutation(api.functions.items.mutations.assign);
  return (id: Id<'items'>, assignedTo?: Id<'users'>): Promise<AssignItemResult> => assign({ id, organizationId: requireOrganizationId(organizationId), assignedTo });
}

export function useDeleteItem(
  organizationId: string | undefined | null
): (id: Id<'items'>) => Promise<DeleteItemResult> {
  const remove = useMutation(api.functions.items.mutations.remove);
  return (id: Id<'items'>): Promise<DeleteItemResult> => remove({ id, organizationId: requireOrganizationId(organizationId) });
}
