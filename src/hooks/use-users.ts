/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';

// Queries
export function useUser(id: Id<'users'> | undefined | null) {
  return useQuery(api.functions.users.queries.getById, id ? { id } : 'skip');
}

export function useUserByWorkosId(workosId: string | undefined | null) {
  return useQuery(
    api.functions.users.queries.getByWorkosId,
    workosId ? { workosId } : 'skip'
  );
}

export function useUserByEmail(email: string | undefined | null) {
  return useQuery(api.functions.users.queries.getByEmail, email ? { email } : 'skip');
}

export function useUsersByOrganization(organizationId: string | undefined | null) {
  return useQuery(
    api.functions.users.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip'
  );
}

export function useCurrentUserByOrganization(organizationId: string | undefined | null) {
  return useQuery(
    api.functions.users.queries.getCurrentByOrganization,
    organizationId ? { organizationId } : 'skip'
  );
}

// Mutations
export function useCreateUser() {
  return useMutation(api.functions.users.mutations.create);
}

export function useUpdateUser() {
  return useMutation(api.functions.users.mutations.update);
}

export function useDeleteUser() {
  return useMutation(api.functions.users.mutations.remove);
}

export function useSyncUserFromWorkOS() {
  return useMutation(api.functions.users.mutations.syncFromWorkOS);
}
