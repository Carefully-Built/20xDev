'use client';

import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';
import { WorkOsWidgets } from '@workos-inc/widgets';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ConvexClientProvider } from './convex-provider';

import type { ReactNode } from 'react';

export { OrganizationProvider, useOrganization } from './organization-provider';
export { UserProvider, useUser } from './user-provider';
export type { UserData } from './user-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps): React.ReactElement => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <NuqsAdapter>
      <AuthKitProvider>
        <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </WorkOsWidgets>
      </AuthKitProvider>
    </NuqsAdapter>
  </ThemeProvider>
);
