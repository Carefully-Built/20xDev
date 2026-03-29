/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';

export function useItem(id: Id<'items'> | undefined | null, organizationId: string | undefined | null) {
  return useQuery(
    api.functions.items.queries.getById,
    id && organizationId ? { id, organizationId } : 'skip'
  );
}

export function useItemsByOrganization(organizationId: string | undefined | null, limit?: number) {
  return useQuery(
    api.functions.items.queries.listByOrganization,
    organizationId ? { organizationId, limit } : 'skip'
  );
}

export function useItemsByStatus(
  organizationId: string | undefined | null,
  status: 'draft' | 'active' | 'archived'
) {
  return useQuery(api.functions.items.queries.listByStatus, organizationId ? { organizationId, status } : 'skip');
}

export function useItemsByPriority(
  organizationId: string | undefined | null,
  priority: 'low' | 'medium' | 'high'
) {
  return useQuery(api.functions.items.queries.listByPriority, organizationId ? { organizationId, priority } : 'skip');
}

export function useItemsByAssignee(
  assignedTo: Id<'users'> | undefined | null,
  organizationId: string | undefined | null
) {
  return useQuery(
    api.functions.items.queries.listByAssignee,
    assignedTo && organizationId ? { assignedTo, organizationId } : 'skip'
  );
}

export function useItemsCountByStatus(organizationId: string | undefined | null) {
  return useQuery(api.functions.items.queries.countByStatus, organizationId ? { organizationId } : 'skip');
}

export function useCreateItem() {
  return useMutation(api.functions.items.mutations.create);
}

export function useUpdateItem() {
  return useMutation(api.functions.items.mutations.update);
}

export function useUpdateItemStatus() {
  return useMutation(api.functions.items.mutations.updateStatus);
}

export function useAssignItem() {
  return useMutation(api.functions.items.mutations.assign);
}

export function useDeleteItem() {
  return useMutation(api.functions.items.mutations.remove);
}
