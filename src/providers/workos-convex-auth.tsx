'use client';

import { useAccessToken, useAuth } from '@workos-inc/authkit-nextjs/components';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useWorkosConvexAuth(): {
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchAccessToken: () => Promise<string | null>;
} {
  const { user, loading, organizationId } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();
  const previousOrganizationId = useRef<string | undefined>(organizationId);

  useEffect((): void => {
    const didOrganizationChange = Boolean(
      user
      && previousOrganizationId.current
      && organizationId
      && previousOrganizationId.current !== organizationId
    );

    if (didOrganizationChange) {
      refresh().catch((error: unknown) => {
        console.error('Failed to refresh WorkOS access token for organization switch:', error);
      });
    }

    previousOrganizationId.current = organizationId;
  }, [organizationId, refresh, user]);

  const fetchAccessToken = useCallback(async (): Promise<string | null> => {
    if (!user) {
      return null;
    }
    return (await getAccessToken()) ?? null;
  }, [getAccessToken, user]);

  return useMemo(() => ({
    isAuthenticated: Boolean(user),
    isLoading: loading,
    fetchAccessToken,
  }), [fetchAccessToken, loading, user]);
}
