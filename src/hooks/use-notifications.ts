import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionReturnType } from 'convex/server';

type NotificationsResult =
  | FunctionReturnType<typeof api.functions.notifications.queries.listByOrganization>
  | undefined;

const areConvexNotificationsEnabled =
  process.env.NEXT_PUBLIC_CONVEX_NOTIFICATIONS_ENABLED === 'true';

function requireOrganizationId(organizationId: string | undefined | null): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }

  return organizationId;
}

export function useNotificationsByOrganization(
  organizationId: string | undefined | null,
): NotificationsResult {
  const notifications = useQuery(
    api.functions.notifications.queries.listByOrganization,
    areConvexNotificationsEnabled && organizationId ? { organizationId } : 'skip',
  );

  return areConvexNotificationsEnabled ? notifications : [];
}

export function useMarkNotificationSeen(
  organizationId: string | undefined | null,
): (id: Id<'notifications'>) => Promise<Id<'notifications'>> {
  const markSeen = useMutation(api.functions.notifications.mutations.markSeen);

  return (id) => markSeen({ id, organizationId: requireOrganizationId(organizationId) });
}

export function useMarkAllNotificationsSeen(
  organizationId: string | undefined | null,
): () => Promise<void> {
  const markAllSeen = useMutation(api.functions.notifications.mutations.markAllSeen);

  return async () => {
    await markAllSeen({ organizationId: requireOrganizationId(organizationId) });
  };
}
