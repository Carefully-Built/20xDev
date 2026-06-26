import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { GTProvider } from 'gt-next';
import { getLocale } from 'gt-next/server';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { AppTopLoader } from '@carefully-built/saas-kit/app-shell';

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

const applyThemeBeforeHydration = `
(() => {
  const storageKey = 'theme';
  const root = document.documentElement;
  const storedTheme = localStorage.getItem(storageKey);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = storedTheme === 'dark' || ((!storedTheme || storedTheme === 'system') && systemDark);

  root.classList.toggle('dark', shouldUseDark);
  root.style.colorScheme = shouldUseDark ? 'dark' : 'light';
})();
`;

const RootLayout = async ({ children }: RootLayoutProps): Promise<React.ReactElement> => {
  // Resolve the request locale (cookie → Accept-Language → default 'en', via the
  // gt-next middleware) so <html lang> and the GTProvider match the user's
  // browser language. Defaults to 'en' when nothing is detected → unchanged.
  const locale = await getLocale();

  return (
  <html
    lang={locale}
    className={`${GeistSans.variable} ${GeistMono.variable}`}
    suppressHydrationWarning
  >
    <head>
      <Script id="apply-theme-before-hydration" strategy="beforeInteractive">
        {applyThemeBeforeHydration}
      </Script>
      <Script id="remove-jam-iframe-before-hydration" strategy="beforeInteractive">
        {removeJamIframeBeforeHydration}
      </Script>
    </head>
    <body className="bg-background min-h-screen font-sans antialiased">
      <GTProvider>
        <Providers>
          <AppTopLoader />
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="bottom-right" richColors />
        </Providers>
      </GTProvider>
    </body>
  </html>
  );
};

export default RootLayout;
