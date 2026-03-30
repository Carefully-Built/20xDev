'use client';

import { ThemeProvider } from 'next-themes';

import type { ReactNode } from 'react';

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
