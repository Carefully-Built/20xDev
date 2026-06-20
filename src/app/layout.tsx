import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { GTProvider } from 'gt-next';
import Script from 'next/script';
import { Toaster } from 'sonner';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';
import { Providers } from '@/providers';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

const removeJamIframeBeforeHydration = `
(() => {
  const removeJamIframe = () => document.getElementById('jam-ui')?.remove();

  removeJamIframe();

  const observer = new MutationObserver(removeJamIframe);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('load', () => observer.disconnect(), { once: true });
})();
`;

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => (
  <html
    lang="en"
    className={`${GeistSans.variable} ${GeistMono.variable}`}
    suppressHydrationWarning
  >
    <Script id="remove-jam-iframe-before-hydration" strategy="beforeInteractive">
      {removeJamIframeBeforeHydration}
    </Script>
    <body className="bg-background min-h-screen font-sans antialiased">
      <GTProvider>
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="bottom-right" richColors />
        </Providers>
      </GTProvider>
    </body>
  </html>
);

export default RootLayout;
