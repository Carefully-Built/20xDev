import {
  BarChart3,
  Bot,
  Building2,
  Clock,
  CreditCard,
  Database,
  Globe,
  Layers,
  Lock,
  Mail,
  Paintbrush,
  Rocket,
  Shield,
  Users,
  Zap,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface FeatureGridItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export interface FeatureWithImageItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
}

export interface FeatureListItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export const featureGridItems: readonly FeatureGridItem[] = [
  {
    icon: Rocket,
    title: 'Production-Ready',
    description:
      'Ship faster with pre-built auth, dashboard, and payments. Everything you need to go live, out of the box.',
  },
  {
    icon: Bot,
    title: 'AI-Optimized',
    description:
      'Clean architecture with clear patterns, perfect for AI code generation. Let AI help you build faster.',
  },
  {
    icon: Building2,
    title: 'B2B SaaS Ready',
    description:
      'Multi-tenant by design with org management and role-based access. Enterprise features built-in.',
  },
  {
    icon: Layers,
    title: 'Modern Stack',
    description:
      'Next.js 16, Convex, WorkOS, and shadcn/ui. The latest tools for building exceptional products.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SSO, SCIM, directory sync, and audit logs. Meet enterprise compliance requirements from day one.',
  },
  {
    icon: Zap,
    title: 'Real-Time Data',
    description:
      'Convex provides instant data sync across all clients. No WebSocket setup or state management hassle.',
  },
] as const;

export const featureWithImageItems: readonly FeatureWithImageItem[] = [
  {
    icon: BarChart3,
    title: 'Beautiful Dashboard',
    description:
      'A fully-featured admin dashboard with analytics, data tables, file management, and organization settings. Built with shadcn/ui components and responsive from mobile to desktop.',
    image: '/images/features/dashboard.png',
    imageAlt: 'Blueprint dashboard showing analytics and data management',
  },
  {
    icon: Lock,
    title: 'Authentication & Teams',
    description:
      'Enterprise-grade auth with WorkOS AuthKit. Social login, email/password, SSO, and multi-tenant organization management with role-based access control.',
    image: '/images/features/auth.png',
    imageAlt: 'Blueprint authentication and team management interface',
  },
  {
    icon: Paintbrush,
    title: 'Stunning Landing Pages',
    description:
      'Conversion-optimized marketing pages with smooth animations, dark mode support, and full responsiveness. Blog powered by Sanity CMS with SEO built-in.',
    image: '/images/features/landing.png',
    imageAlt: 'Blueprint landing page with hero section and features',
  },
] as const;

export const featureListItems: readonly FeatureListItem[] = [
  {
    icon: CreditCard,
    title: 'Stripe Payments',
    description:
      'Subscriptions, one-time charges, and usage-based billing with webhook sync to Convex.',
  },
  {
    icon: Globe,
    title: 'Internationalization',
    description:
      'AI-powered translations with General Translation. Add new languages without maintaining JSON files.',
  },
  {
    icon: Database,
    title: 'Real-Time Database',
    description:
      'Convex provides type-safe queries, mutations, and automatic real-time subscriptions.',
  },
  {
    icon: Mail,
    title: 'Transactional Email',
    description:
      'Beautiful emails with Resend and React Email. Welcome emails, notifications, and more.',
  },
  {
    icon: Users,
    title: 'Organization Management',
    description:
      'Multi-tenant architecture with WorkOS. Team invites, role management, and org switching.',
  },
  {
    icon: Clock,
    title: 'CI/CD Pipeline',
    description:
      'GitHub Actions, CodeRabbit reviews, SonarCloud analysis, and Vercel deployments out of the box.',
  },
] as const;
