import { Footer } from './Footer';
import { SiteHeader } from './site-header';

import type { LayoutProps } from '@/types';

interface LandingFooterCta {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

interface PageLayoutProps extends LayoutProps {
  /** Whether to show the footer. Defaults to true. */
  showFooter?: boolean;
  /** Visual treatment for public vs app surfaces. */
  variant?: 'default' | 'landing';
  /** Optional landing footer CTA override. */
  footerCta?: LandingFooterCta | null | 'auto';
}

export function PageLayout({
  children,
  showFooter = true,
  variant = 'default',
  footerCta = 'auto',
}: PageLayoutProps): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader variant={variant} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer variant={variant} cta={footerCta} />}
    </div>
  );
}
