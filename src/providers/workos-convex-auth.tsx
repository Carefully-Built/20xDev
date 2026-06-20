'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ConvexTokenResponse {
  readonly token: string | null;
}

async function fetchConvexToken(forceRefreshToken: boolean): Promise<string | null> {
  try {
    const response = await fetch(`/api/auth/convex-token${forceRefreshToken ? '?refresh=1' : ''}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ConvexTokenResponse;

    return data.token;
  } catch (error) {
    console.warn('Unable to fetch data auth token:', error);
    return null;
  }
}

export function useWorkosConvexAuth(): {
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchAccessToken: (args?: { forceRefreshToken?: boolean }) => Promise<string | null>;
} {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRequestRef = useRef<Promise<string | null> | null>(null);

  const loadToken = useCallback(
    async (forceRefreshToken = false, showLoading = false): Promise<string | null> => {
      if (!forceRefreshToken && tokenRequestRef.current) {
        return tokenRequestRef.current;
      }

      if (showLoading) {
        setIsLoading(true);
      }

      const tokenRequest = fetchConvexToken(forceRefreshToken).then((nextToken) => {
        setToken(nextToken);
        return nextToken;
      });

      tokenRequestRef.current = tokenRequest;

      try {
        return await tokenRequest;
      } finally {
        if (tokenRequestRef.current === tokenRequest) {
          tokenRequestRef.current = null;
        }
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void loadToken(false, true);
  }, [loadToken]);

  const fetchAccessToken = useCallback(
    async (args: { forceRefreshToken?: boolean } = {}) => {
      if (args.forceRefreshToken) {
        return loadToken(true);
      }

      if (!token) {
        return loadToken();
      }

      return token;
    },
    [loadToken, token],
  );

  return useMemo(
    () => ({
      fetchAccessToken,
      isAuthenticated: Boolean(token),
      isLoading,
    }),
    [fetchAccessToken, isLoading, token],
  );
}
