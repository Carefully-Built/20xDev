import { LandingLayoutClient } from './_components/landing-layout-client';

import type { LayoutProps } from '@/types';

import { IntercomProvider } from '@/components/intercom-provider';
import { PageLayout } from '@/components/layout/PageLayout';

export default function LandingLayout({ children }: LayoutProps): React.ReactElement {
  return (
    <PageLayout>
      <IntercomProvider>
        <LandingLayoutClient>{children}</LandingLayoutClient>
      </IntercomProvider>
    </PageLayout>
  );
}
