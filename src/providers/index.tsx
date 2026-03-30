'use client';

import { Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { PostHogProvider } from '@/components/providers/posthog-provider';
import { ConvexClientProvider } from './convex-provider';
import { QueryProvider } from './query-provider';

import type { ReactNode } from 'react';

export { OrganizationProvider, useOrganization } from './organization-provider';
export { UserProvider, useUser } from './user-provider';
export type { UserData } from './user-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps): React.ReactElement => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Suspense fallback={null}>
      <PostHogProvider>
        <NuqsAdapter>
          <QueryProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </QueryProvider>
        </NuqsAdapter>
      </PostHogProvider>
    </Suspense>
  </ThemeProvider>
);
