'use client';

import { WorkOsWidgets } from '@workos-inc/widgets';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';

import { ConvexClientProvider } from './convex-provider';
import { QueryProvider } from './query-provider';

import type { ReactNode } from 'react';

import { PostHogProvider } from '@/components/providers/posthog-provider';

export { OrganizationProvider, useOrganization } from './organization-provider';
export { UserProvider, useUser } from './user-provider';
export type { UserData } from './user-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps): React.ReactElement => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </ThemeProvider>
);
