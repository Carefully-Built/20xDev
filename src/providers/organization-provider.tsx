'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { ReactNode } from 'react';

interface OrganizationContextValue {
  organizationId: string | null;
  setOrganizationId: (id: string | null) => void;
  refreshOrganization: () => void;
}

interface OrganizationsResponse {
  organizations: { id: string }[];
  currentOrganizationId?: string | null;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

interface OrganizationProviderProps {
  readonly children: ReactNode;
  readonly initialOrganizationId?: string;
}

function getNextOrganizationId(data: OrganizationsResponse): string | null {
  return data.currentOrganizationId ?? data.organizations[0]?.id ?? null;
}

export function OrganizationProvider({
  children,
  initialOrganizationId,
}: OrganizationProviderProps): React.ReactElement {
  const [organizationId, setOrganizationId] = useState(initialOrganizationId ?? null);

  const refreshOrganization = useCallback((): void => {
    fetch('/api/organizations')
      .then((res) => (res.ok ? res.json() : { organizations: [] }))
      .then((data: OrganizationsResponse) => {
        setOrganizationId(getNextOrganizationId(data));
      })
      .catch(() => {
        // Keep the current organization when the optional API is unavailable.
      });
  }, []);

  useEffect(() => {
    setOrganizationId(initialOrganizationId ?? null);
  }, [initialOrganizationId]);

  useEffect(() => {
    const handleOrgUpdate = (): void => {
      refreshOrganization();
    };

    globalThis.addEventListener('org-updated', handleOrgUpdate);
    return (): void => {
      globalThis.removeEventListener('org-updated', handleOrgUpdate);
    };
  }, [refreshOrganization]);

  const contextValue = useMemo(
    () => ({
      organizationId,
      refreshOrganization,
      setOrganizationId,
    }),
    [organizationId, refreshOrganization],
  );

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextValue {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
