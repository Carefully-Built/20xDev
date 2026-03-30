'use client';

import { useCallback, useMemo } from 'react';

export function useWorkosConvexAuth(): {
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchAccessToken: (args: { forceRefreshToken: boolean }) => Promise<string | null>;
} {
  const fetchAccessToken = useCallback(async (): Promise<string | null> => null, []);

  return useMemo(() => ({
    isAuthenticated: false,
    isLoading: false,
    fetchAccessToken,
  }), [fetchAccessToken]);
}
