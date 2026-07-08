import { Footer } from './Footer';
import { SiteHeader } from './site-header';

import type { LayoutProps } from '@/types';

interface LandingFooterCta {
  readonly title: string;
  readonly description: string;
  readonly buttonLabel: string;
  readonly buttonHref: string;
}

interface PageLayoutProps extends LayoutProps {
  /** Whether to show the footer. Defaults to true. */
  readonly showFooter?: boolean;
  /** Visual treatment for public vs app surfaces. */
  readonly variant?: 'default' | 'landing';
  /** Optional landing footer CTA override. */
  readonly footerCta?: LandingFooterCta | null | 'auto';
}

export function PageLayout({
  children,
  showFooter = true,
  variant = 'default',
  footerCta = 'auto',
}: Readonly<PageLayoutProps>): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader variant={variant} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer variant={variant} cta={footerCta} />}
    </div>
  );
}
