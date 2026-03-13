import { Footer } from './Footer';
import { SiteHeader } from './site-header';

import type { LayoutProps } from '@/types';


interface PageLayoutProps extends LayoutProps {
  /** Whether to show the footer. Defaults to true. */
  showFooter?: boolean;
  /** Visual treatment for public vs app surfaces. */
  variant?: 'default' | 'landing';
}

export function PageLayout({ 
  children, 
  showFooter = true,
  variant = 'default',
}: PageLayoutProps): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader variant={variant} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer variant={variant} />}
    </div>
  );
}
