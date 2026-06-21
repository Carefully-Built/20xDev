/**
 * Site Configuration
 *
 * Central place for all site-wide constants.
 * Change these values to customize the site.
 */

import type { NavItem } from '@/types';

interface SiteLink {
  readonly title: string;
  readonly href: string;
}

interface FooterColumn {
  readonly title: string;
  readonly links: readonly SiteLink[];
}

function link(title: string, href: string): SiteLink {
  return { title, href };
}

function featureLinks(titles: readonly string[]): readonly SiteLink[] {
  return titles.map((title) => link(title, '/#features'));
}

const mainNav = [
  link('Pricing', '/pricing'),
  link('Blog', '/blog'),
  link('About', '/about'),
  link('Contact', '/contact'),
] as const;

const footerColumns: readonly FooterColumn[] = [
  {
    title: 'Product',
    links: [link('Dashboard', '/dashboard'), link('Blog', '/blog')],
  },
  {
    title: 'Platform',
    links: featureLinks(['Authentication', 'Organizations', 'Real-time Data']),
  },
  {
    title: 'Industries',
    links: featureLinks(['B2B SaaS', 'Internal Tools', 'AI Products']),
  },
  {
    title: 'Customers',
    links: featureLinks(['Startups', 'Product Teams', 'Agencies']),
  },
  {
    title: 'Company',
    links: [
      link('About', '/about'),
      link('Contact', '/contact'),
      link('GitHub', 'https://github.com/20xdev/20xdev'),
      link('X / Twitter', 'https://twitter.com/20xdev'),
    ],
  },
  {
    title: 'Resources',
    links: [
      link('Privacy Policy', '/privacy'),
      link('Terms', '/terms'),
      link('Support', '/contact'),
    ],
  },
];

export const siteConfig = {
  // Brand
  name: '20xdev',
  logo: '/images/black_logo.png',
  description:
    'Production-ready foundation for B2B SaaS. Ship faster with pre-built auth, payments, and real-time data.',

  // URLs
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

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
    main: mainNav,
    footer: {
      columns: footerColumns,
      bottomLinks: [link('Privacy Policy', '/privacy'), link('Security', '/contact')],
    },
  },
};

// Export nav items for components that need them directly
export const landingNav: NavItem[] = [...siteConfig.nav.main];
