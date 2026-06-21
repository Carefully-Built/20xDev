import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionArgs, FunctionReturnType } from 'convex/server';

type ActivitiesResult =
  | FunctionReturnType<typeof api.functions.activities.queries.listByOrganization>
  | undefined;
type AssociationOptionsResult =
  | FunctionReturnType<typeof api.functions.activities.queries.listAssociationOptions>
  | undefined;
type CreateActivityData = FunctionArgs<typeof api.functions.activities.mutations.create>['data'];
type UpdateActivityData = FunctionArgs<typeof api.functions.activities.mutations.update>['data'];
type AttachGoogleCalendarEventArgs = FunctionArgs<
  typeof api.functions.activities.mutations.attachGoogleCalendarEvent
>;

function requireOrganizationId(organizationId: string | undefined | null): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }

  return organizationId;
}

export function useActivitiesByOrganization(
  organizationId: string | undefined | null,
): ActivitiesResult {
  return useQuery(
    api.functions.activities.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useActivityAssociationOptions(
  organizationId: string | undefined | null,
): AssociationOptionsResult {
  return useQuery(
    api.functions.activities.queries.listAssociationOptions,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useCreateActivity(
  organizationId: string | undefined | null,
): (data: CreateActivityData) => Promise<Id<'activities'>> {
  const create = useMutation(api.functions.activities.mutations.create);

  return (data) => create({ data, organizationId: requireOrganizationId(organizationId) });
}

export function useUpdateActivity(
  organizationId: string | undefined | null,
): (id: Id<'activities'>, data: UpdateActivityData) => Promise<unknown> {
  const update = useMutation(api.functions.activities.mutations.update);

  return (id, data) => update({ data, id, organizationId: requireOrganizationId(organizationId) });
}

export function useDeleteActivity(
  organizationId: string | undefined | null,
): (id: Id<'activities'>) => Promise<null> {
  const remove = useMutation(api.functions.activities.mutations.remove);

  return (id) => remove({ id, organizationId: requireOrganizationId(organizationId) });
}

export function useAttachGoogleCalendarEvent(
  organizationId: string | undefined | null,
): (
  args: Omit<AttachGoogleCalendarEventArgs, 'organizationId'>,
) => Promise<unknown> {
  const attach = useMutation(api.functions.activities.mutations.attachGoogleCalendarEvent);

  return (args) => attach({ ...args, organizationId: requireOrganizationId(organizationId) });
}
