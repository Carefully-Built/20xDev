import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionArgs, FunctionReturnType } from 'convex/server';

type ContactResult = FunctionReturnType<typeof api.functions.contacts.queries.getById> | undefined;
type ContactsResult =
  | FunctionReturnType<typeof api.functions.contacts.queries.listByOrganization>
  | undefined;
type ContactSummaryResult =
  | FunctionReturnType<typeof api.functions.contacts.queries.summary>
  | undefined;
type CreateContactData = FunctionArgs<typeof api.functions.contacts.mutations.create>['data'];
type UpdateContactData = FunctionArgs<typeof api.functions.contacts.mutations.update>['data'];
type UpdateContactResult = FunctionReturnType<typeof api.functions.contacts.mutations.update>;
type DeleteContactResult = FunctionReturnType<typeof api.functions.contacts.mutations.remove>;

function requireOrganizationId(organizationId: string | undefined | null): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }

  return organizationId;
}

export function useContact(
  id: Id<'contacts'> | undefined | null,
  organizationId: string | undefined | null,
): ContactResult {
  return useQuery(
    api.functions.contacts.queries.getById,
    id && organizationId ? { id, organizationId } : 'skip',
  );
}

export function useContactsByOrganization(
  organizationId: string | undefined | null,
  limit?: number,
): ContactsResult {
  return useQuery(
    api.functions.contacts.queries.listByOrganization,
    organizationId ? { limit, organizationId } : 'skip',
  );
}

export function useContactSummary(organizationId: string | undefined | null): ContactSummaryResult {
  return useQuery(
    api.functions.contacts.queries.summary,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useCreateContact(
  organizationId: string | undefined | null,
): (data: CreateContactData) => Promise<Id<'contacts'>> {
  const create = useMutation(api.functions.contacts.mutations.create);

  return (data) => create({ data, organizationId: requireOrganizationId(organizationId) });
}

export function useUpdateContact(
  organizationId: string | undefined | null,
): (id: Id<'contacts'>, data: UpdateContactData) => Promise<UpdateContactResult> {
  const update = useMutation(api.functions.contacts.mutations.update);

  return (id, data) => update({ data, id, organizationId: requireOrganizationId(organizationId) });
}

export function useDeleteContact(
  organizationId: string | undefined | null,
): (id: Id<'contacts'>) => Promise<DeleteContactResult> {
  const remove = useMutation(api.functions.contacts.mutations.remove);

  return (id) => remove({ id, organizationId: requireOrganizationId(organizationId) });
}
