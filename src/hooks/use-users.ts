import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { FunctionReturnType } from 'convex/server';
import type { FunctionArgs } from 'convex/server';

type CurrentUserResult =
  | FunctionReturnType<typeof api.functions.users.queries.getCurrentByOrganization>
  | undefined;
type UsersResult =
  | FunctionReturnType<typeof api.functions.users.queries.listByOrganization>
  | undefined;
type UpdateIntegrationPreferencesArgs = FunctionArgs<
  typeof api.functions.users.mutations.updateIntegrationPreferences
>;

export function useCurrentUserByOrganization(
  organizationId: string | undefined | null,
): CurrentUserResult {
  return useQuery(
    api.functions.users.queries.getCurrentByOrganization,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useUsersByOrganization(organizationId: string | undefined | null): UsersResult {
  return useQuery(
    api.functions.users.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useUpdateIntegrationPreferences(): (
  args: UpdateIntegrationPreferencesArgs,
) => Promise<unknown> {
  return useMutation(api.functions.users.mutations.updateIntegrationPreferences);
}
