/**
 * Site Configuration
 * 
 * Central place for all site-wide constants.
 * Change these values to customize the site.
 */

export const siteConfig = {
  // Brand
  name: 'Blueprint',
  description: 'Production-ready foundation for B2B SaaS. Ship faster with pre-built auth, payments, and real-time data.',
  
  // URLs
  url: 'https://cb-blueprint.vercel.app',
  
  // Legal
  companyName: 'Blueprint',
  
  // Social
  social: {
    twitter: 'https://twitter.com/blueprint',
    github: 'https://github.com/Carefully-Built/blueprint',
  },
  
  // Contact
  email: 'hello@blueprint.dev',
  
  // Copyright
  copyrightYear: new Date().getFullYear(),
  
  // Navigation
  nav: {
    main: [
      { title: 'Features', href: '/features' },
      { title: 'Pricing', href: '/pricing' },
      { title: 'Blog', href: '/blog' },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
    ],
    footer: {
      product: [
        { title: 'Features', href: '/features' },
        { title: 'Pricing', href: '/pricing' },
        { title: 'Documentation', href: '/docs' },
        { title: 'Contact', href: '/contact' },
      ],
      legal: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
      ],
    },
  },
};

export type SiteConfig = typeof siteConfig;

// Export nav items for components that need them directly  
import type { NavItem } from '@/types';
export const landingNav: NavItem[] = siteConfig.nav.main;
