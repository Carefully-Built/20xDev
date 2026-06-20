import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';

import type { FunctionReturnType } from 'convex/server';

type CurrentUserResult =
  | FunctionReturnType<typeof api.functions.users.queries.getCurrentByOrganization>
  | undefined;
type UsersResult =
  | FunctionReturnType<typeof api.functions.users.queries.listByOrganization>
  | undefined;

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
