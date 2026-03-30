import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';

import { filterItemsByOrganization } from './filter-items-by-organization';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionReturnType } from 'convex/server';

type ItemResult = FunctionReturnType<typeof api.functions.items.queries.getById> | undefined;
type ItemsResult = FunctionReturnType<typeof api.functions.items.queries.listByOrganization> | undefined;
type StatusItemsResult = FunctionReturnType<typeof api.functions.items.queries.listByStatus> | undefined;
type PriorityItemsResult = FunctionReturnType<typeof api.functions.items.queries.listByPriority> | undefined;
type AssigneeItemsResult = FunctionReturnType<typeof api.functions.items.queries.listByAssignee> | undefined;
type CountResult = FunctionReturnType<typeof api.functions.items.queries.countByStatus> | undefined;

export function useItem(
  id: Id<'items'> | undefined | null,
  organizationId: string | undefined | null
): ItemResult {
  return useQuery(
    api.functions.items.queries.getById,
    id && organizationId ? { id, organizationId } : 'skip'
  );
}

export function useItemsByOrganization(
  organizationId: string | undefined | null,
  limit?: number
): ItemsResult {
  const items = useQuery(
    api.functions.items.queries.listByOrganization,
    organizationId ? { organizationId, limit } : 'skip'
  );
  return filterItemsByOrganization(items, organizationId);
}

export function useItemsByStatus(
  organizationId: string | undefined | null,
  status: 'draft' | 'active' | 'archived'
): StatusItemsResult {
  const items = useQuery(
    api.functions.items.queries.listByStatus,
    organizationId ? { organizationId, status } : 'skip'
  );
  return filterItemsByOrganization(items, organizationId);
}

export function useItemsByPriority(
  organizationId: string | undefined | null,
  priority: 'low' | 'medium' | 'high'
): PriorityItemsResult {
  const items = useQuery(
    api.functions.items.queries.listByPriority,
    organizationId ? { organizationId, priority } : 'skip'
  );
  return filterItemsByOrganization(items, organizationId);
}

export function useItemsByAssignee(
  assignedTo: Id<'users'> | undefined | null,
  organizationId: string | undefined | null
): AssigneeItemsResult {
  const items = useQuery(
    api.functions.items.queries.listByAssignee,
    assignedTo && organizationId ? { assignedTo, organizationId } : 'skip'
  );
  return filterItemsByOrganization(items, organizationId);
}

export function useItemsCountByStatus(organizationId: string | undefined | null): CountResult {
  return useQuery(api.functions.items.queries.countByStatus, organizationId ? { organizationId } : 'skip');
}
