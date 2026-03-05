import type { NavItem, SidebarConfig } from '@/types';

export const siteConfig = {
  name: 'Blueprint',
  description: 'Production-ready Next.js dashboard template',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
} as const;

export const dashboardNav: SidebarConfig = {
  main: [
    { title: 'Dashboard', href: '/dashboard', icon: 'home' },
    { title: 'Analytics', href: '/dashboard/analytics', icon: 'chart' },
    { title: 'Customers', href: '/dashboard/customers', icon: 'users' },
    { title: 'Products', href: '/dashboard/products', icon: 'package' },
    { title: 'Orders', href: '/dashboard/orders', icon: 'shopping-cart' },
  ],
  secondary: [
    { title: 'Settings', href: '/dashboard/settings', icon: 'settings' },
    { title: 'Help', href: '/dashboard/help', icon: 'help-circle' },
  ],
};

export const landingNav: NavItem[] = [
  { title: 'Features', href: '/#features' },
  { title: 'Pricing', href: '/#pricing' },
  { title: 'Blog', href: '/blog' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];
