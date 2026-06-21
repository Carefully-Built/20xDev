'use client';

import { useEffect, useMemo, useState } from 'react';

import type { WidgetScopes } from '@carefully-built/workos/server';

interface WidgetTokenResponse {
  token: string;
}

interface UseWidgetTokenOptions {
  /** Required scopes for the widget */
  scopes: WidgetScopes[];
  /** Organization ID (required for most widgets) */
  organizationId: string;
}

/**
 * Hook to get a widget token for WorkOS widgets.
 * Fetches the token from the API and caches it.
 *
 * @example
 * ```tsx
 * const { token, loading, error } = useWidgetToken({
 *   scopes: ['widgets:organization-switcher:read']
 * });
 *
 * if (loading) return <Skeleton />;
 * if (error) return <div>Error: {error}</div>;
 *
 * return <OrgSwitcher authToken={token} />;
 * ```
 */
export function useWidgetToken({ scopes, organizationId }: UseWidgetTokenOptions): {
  token: string | null;
  loading: boolean;
  error: string | null;
} {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scopesKey = useMemo(() => scopes.join(','), [scopes]);

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/widgets/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scopes, organizationId }),
        });

        if (!response.ok) {
          throw new Error('Failed to get widget token');
        }

        const data = (await response.json()) as WidgetTokenResponse;
        setToken(data.token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchToken();
  }, [scopesKey, scopes, organizationId]);

  return { token, loading, error };
}
