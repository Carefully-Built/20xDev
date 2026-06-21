'use client';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import type { ReactNode } from 'react';

export { OrganizationProvider, useOrganization } from './organization-provider';
export { UserProvider, useUser } from './user-provider';
export { ConvexClientProvider } from './convex-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps): React.ReactElement => (
  <NuqsAdapter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  </NuqsAdapter>
);
