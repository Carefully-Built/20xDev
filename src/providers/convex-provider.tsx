'use client';

import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { useMemo } from 'react';

import { useWorkosConvexAuth } from './workos-convex-auth';

import type { ReactNode } from 'react';

interface ConvexClientProviderProps {
  readonly children: ReactNode;
}

export function ConvexClientProvider({
  children,
}: ConvexClientProviderProps): React.ReactElement {
  const client = useMemo(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    return convexUrl ? new ConvexReactClient(convexUrl) : null;
  }, []);

  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithAuth client={client} useAuth={useWorkosConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}
