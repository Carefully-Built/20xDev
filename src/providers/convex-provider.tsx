'use client';

import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { useMemo } from 'react';

import { useWorkosConvexAuth } from './workos-convex-auth';

import type { ReactNode } from 'react';

interface ConvexClientProviderProps {
  readonly children: ReactNode;
}

function AuthenticatedConvexProvider({
  children,
  client,
}: ConvexClientProviderProps & {
  readonly client: ConvexReactClient;
}): React.ReactElement {
  return (
    <ConvexProviderWithAuth client={client} useAuth={useWorkosConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
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
    <AuthenticatedConvexProvider client={client}>
      {children}
    </AuthenticatedConvexProvider>
  );
}
