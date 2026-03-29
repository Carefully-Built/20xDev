/**
 * Site Configuration
 *
 * Central place for all site-wide constants.
 * Change these values to customize the site.
 */

export const siteConfig = {
  // Brand
  name: '20xdev',
  logo: '/images/black_logo.png',
  description:
    'Production-ready foundation for B2B SaaS. Ship faster with pre-built auth, payments, and real-time data.',

  // URLs
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Legal
  companyName: '20xdev',

  // Social
  social: {
    twitter: 'https://twitter.com/20xdev',
    github: 'https://github.com/20xdev/20xdev',
  },

  // Contact
  email: 'hello@20xdev.com',

  // Copyright
  copyrightYear: new Date().getFullYear(),

  // Navigation
  nav: {
    main: [
      { title: 'Pricing', href: '/pricing' },
      { title: 'Blog', href: '/blog' },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
    ],
    footer: {
      columns: [
        {
          title: 'Product',
          links: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Blog', href: '/blog' },
          ],
        },
        {
          title: 'Platform',
          links: [
            { title: 'Authentication', href: '/#features' },
            { title: 'Organizations', href: '/#features' },
            { title: 'Real-time Data', href: '/#features' },
          ],
        },
        {
          title: 'Industries',
          links: [
            { title: 'B2B SaaS', href: '/#features' },
            { title: 'Internal Tools', href: '/#features' },
            { title: 'AI Products', href: '/#features' },
          ],
        },
        {
          title: 'Customers',
          links: [
            { title: 'Startups', href: '/#features' },
            { title: 'Product Teams', href: '/#features' },
            { title: 'Agencies', href: '/#features' },
          ],
        },
        {
          title: 'Company',
          links: [
            { title: 'About', href: '/about' },
            { title: 'Contact', href: '/contact' },
            { title: 'GitHub', href: 'https://github.com/20xdev/20xdev' },
            { title: 'X / Twitter', href: 'https://twitter.com/20xdev' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Terms', href: '/terms' },
            { title: 'Support', href: '/contact' },
          ],
        },
      ],
      bottomLinks: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Security', href: '/contact' },
      ],
    },
  },
};

export type SiteConfig = typeof siteConfig;

// Export nav items for components that need them directly
import type { NavItem } from '@/types';
export const landingNav: NavItem[] = siteConfig.nav.main;
