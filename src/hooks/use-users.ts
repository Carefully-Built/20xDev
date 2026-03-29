import { api } from '@convex/_generated/api';
import { useMutation, useQuery, type ReactMutation } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';
import type { FunctionReturnType } from 'convex/server';

type UserResult = FunctionReturnType<typeof api.functions.users.queries.getById> | undefined;
type WorkosUserResult = FunctionReturnType<typeof api.functions.users.queries.getByWorkosId> | undefined;
type EmailUserResult = FunctionReturnType<typeof api.functions.users.queries.getByEmail> | undefined;
type OrganizationUsersResult = FunctionReturnType<typeof api.functions.users.queries.listByOrganization> | undefined;
type CurrentUserResult = FunctionReturnType<typeof api.functions.users.queries.getCurrentByOrganization> | undefined;

export function useUser(id: Id<'users'> | undefined | null): UserResult {
  return useQuery(api.functions.users.queries.getById, id ? { id } : 'skip');
}

export function useUserByWorkosId(workosId: string | undefined | null): WorkosUserResult {
  return useQuery(
    api.functions.users.queries.getByWorkosId,
    workosId ? { workosId } : 'skip'
  );
}

export function useUserByEmail(email: string | undefined | null): EmailUserResult {
  return useQuery(api.functions.users.queries.getByEmail, email ? { email } : 'skip');
}

export function useUsersByOrganization(organizationId: string | undefined | null): OrganizationUsersResult {
  return useQuery(
    api.functions.users.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip'
  );
}

export function useCurrentUserByOrganization(organizationId: string | undefined | null): CurrentUserResult {
  return useQuery(
    api.functions.users.queries.getCurrentByOrganization,
    organizationId ? { organizationId } : 'skip'
  );
}

export function useCreateUser(): ReactMutation<typeof api.functions.users.mutations.create> {
  return useMutation(api.functions.users.mutations.create);
}

export function useUpdateUser(): ReactMutation<typeof api.functions.users.mutations.update> {
  return useMutation(api.functions.users.mutations.update);
}

export function useDeleteUser(): ReactMutation<typeof api.functions.users.mutations.remove> {
  return useMutation(api.functions.users.mutations.remove);
}

export function useSyncUserFromWorkOS(): ReactMutation<typeof api.functions.users.mutations.syncFromWorkOS> {
  return useMutation(api.functions.users.mutations.syncFromWorkOS);
}
