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

// Social URLs are env-overridable so a fork rebrands without editing source.
// Defaults preserve the current 20xdev values when the env vars are unset.
const socialGithub = process.env.NEXT_PUBLIC_BRAND_GITHUB ?? 'https://github.com/20xdev/20xdev';
const socialTwitter = process.env.NEXT_PUBLIC_BRAND_TWITTER ?? 'https://twitter.com/20xdev';

// Feature flags — let a fork hide marketing surfaces cleanly. Default ON so
// 20xdev's own site is unchanged; a fork sets NEXT_PUBLIC_FEATURE_*=0 to disable.
// When a surface is off, its nav/footer entries are dropped here so there are no
// dangling links, and the route itself 404s (see the route guards).
const featureMarketingSite = process.env.NEXT_PUBLIC_FEATURE_MARKETING_SITE !== '0';
const featureBlog = process.env.NEXT_PUBLIC_FEATURE_BLOG !== '0';
const featureStudio = process.env.NEXT_PUBLIC_FEATURE_STUDIO !== '0';

const mainNav: readonly SiteLink[] = [
  link('Pricing', '/pricing'),
  ...(featureBlog ? [link('Blog', '/blog')] : []),
  link('About', '/about'),
  link('Contact', '/contact'),
];

const footerColumns: readonly FooterColumn[] = [
  {
    title: 'Product',
    links: [link('Dashboard', '/dashboard'), ...(featureBlog ? [link('Blog', '/blog')] : [])],
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
      link('GitHub', socialGithub),
      link('X / Twitter', socialTwitter),
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
  // Brand — env-overridable (NEXT_PUBLIC_BRAND_*) so a fork white-labels with
  // config only. Each default preserves the current 20xdev value when unset.
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? '20xdev',
  logo: process.env.NEXT_PUBLIC_BRAND_LOGO ?? '/images/black_logo.png',
  ogImage: process.env.NEXT_PUBLIC_BRAND_OG_IMAGE ?? '/images/banner.png',
  description:
    process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ??
    'Production-ready foundation for B2B SaaS. Ship faster with pre-built auth, payments, and real-time data.',

  // URLs
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

  // Legal
  companyName: process.env.NEXT_PUBLIC_BRAND_COMPANY ?? '20xdev',

  // Social
  social: {
    twitter: socialTwitter,
    github: socialGithub,
  },

  // Contact
  email: process.env.NEXT_PUBLIC_BRAND_EMAIL ?? 'hello@20xdev.com',

  // Attribution — "Built with 20xDev" credit, isolated from product brand.
  // Off by default (20xdev's own site is unchanged); a fork opts in with
  // NEXT_PUBLIC_BRAND_ATTRIBUTION=1 to keep the kit credit in its footer.
  attribution: {
    enabled: process.env.NEXT_PUBLIC_BRAND_ATTRIBUTION === '1',
    label: 'Built with 20xDev',
    href: 'https://github.com/Carefully-Built/20xDev',
  },

  // Feature flags — read by route guards to 404 disabled marketing surfaces.
  features: {
    marketingSite: featureMarketingSite,
    blog: featureBlog,
    studio: featureStudio,
  },

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
