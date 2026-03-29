'use client';

import { useAccessToken, useAuth } from '@workos-inc/authkit-nextjs/components';
import { useCallback, useMemo } from 'react';

export function useWorkosConvexAuth(): {
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchAccessToken: () => Promise<string | null>;
} {
  const { user, loading } = useAuth();
  const { getAccessToken } = useAccessToken();

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
