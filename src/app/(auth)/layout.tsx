'use client';

import { AuthPagesConfigProvider } from '@carefully-built/saas-kit/auth-pages/config';

import { authPagesConfig } from './auth-page-config';

interface AuthRouteLayoutProps {
  readonly children: React.ReactNode;
}

export default function AuthRouteLayout({
  children,
}: AuthRouteLayoutProps): React.ReactElement {
  return (
    <AuthPagesConfigProvider config={authPagesConfig}>
      {children}
    </AuthPagesConfigProvider>
  );
}
