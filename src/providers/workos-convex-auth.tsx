'use client';

import { useAccessToken, useAuth } from '@workos-inc/authkit-nextjs/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getTokenOrganizationId } from '@/lib/workos-token';

export function useWorkosConvexAuth(): {
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchAccessToken: (args?: { forceRefreshToken?: boolean }) => Promise<string | null>;
} {
  const { user, loading: authLoading, organizationId, refreshAuth } = useAuth();
  const { accessToken, getAccessToken, loading: tokenLoading, refresh } = useAccessToken();
  const [isRefreshingOrganization, setIsRefreshingOrganization] = useState<boolean>(false);
  const pendingOrganizationId = useRef<string | null>(null);
  const refreshOrganizationToken = useCallback(async (
    nextOrganizationId: string
  ): Promise<string | null> => {
    const authResult = await refreshAuth({
      ensureSignedIn: true,
      organizationId: nextOrganizationId,
    });
    if (authResult?.error) {
      throw new Error(authResult.error);
    }
    return (await refresh()) ?? null;
  }, [refresh, refreshAuth]);
  const getHasOrganizationTokenMismatch = useCallback((
    token: string | undefined,
    nextOrganizationId: string
  ): boolean => getTokenOrganizationId(token) !== nextOrganizationId, []);

  useEffect((): void => {
    if (!user || !organizationId || !getHasOrganizationTokenMismatch(accessToken, organizationId)) {
      pendingOrganizationId.current = null;
      setIsRefreshingOrganization(false);
      return;
    }
    if (authLoading || tokenLoading || pendingOrganizationId.current === organizationId) {
      return;
    }
    pendingOrganizationId.current = organizationId;
    setIsRefreshingOrganization(true);
    refreshOrganizationToken(organizationId)
      .catch((error: unknown) => {
        console.error('Failed to refresh WorkOS auth for Convex organization switch:', error);
      })
      .finally((): void => {
        if (pendingOrganizationId.current === organizationId) {
          pendingOrganizationId.current = null;
        }
        setIsRefreshingOrganization(false);
      });
  }, [accessToken, authLoading, getHasOrganizationTokenMismatch, organizationId, refreshAuth, refreshOrganizationToken, tokenLoading, user]);

  const fetchAccessToken = useCallback(async (
    args: { forceRefreshToken?: boolean } = {}
  ): Promise<string | null> => {
    if (!user) {
      return null;
    }
    try {
      if (organizationId) {
        const needsOrganizationRefresh = (args.forceRefreshToken ?? false)
          || getHasOrganizationTokenMismatch(accessToken, organizationId);
        if (needsOrganizationRefresh) {
          return await refreshOrganizationToken(organizationId);
        }
      }
      const token = await getAccessToken();
      if (token) {
        return token;
      }
      return organizationId ? await refreshOrganizationToken(organizationId) : null;
    } catch (error: unknown) {
      console.error('Failed to get WorkOS access token for Convex:', error);
      return null;
    }
  }, [accessToken, getAccessToken, getHasOrganizationTokenMismatch, organizationId, refreshOrganizationToken, user]);

  return useMemo(() => ({
    isAuthenticated: Boolean(user),
    isLoading: authLoading || tokenLoading || isRefreshingOrganization,
    fetchAccessToken,
  }), [authLoading, fetchAccessToken, isRefreshingOrganization, tokenLoading, user]);
}
