import { LandingHeaderObserver } from './_components/landing-header-observer';

import type { LayoutProps } from '@/types';

import { PageLayout } from '@/components/layout/PageLayout';

export default function LandingLayout({ children }: LayoutProps): React.ReactElement {
  return (
    <div className="landing-shell">
      <LandingHeaderObserver />
      <PageLayout variant="landing">{children}</PageLayout>
    </div>
  );
}
