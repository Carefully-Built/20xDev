export interface TechItem {
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly why: string;
  readonly logo: string;
  readonly href?: string;
  readonly className?: string;
}

function techItem(
  name: string,
  category: string,
  description: string,
  why: string,
  logo: string,
  href?: string,
  className?: string,
): TechItem {
  return {
    name,
    category,
    description,
    why,
    logo,
    href,
    className,
  };
}

export const techStack: readonly TechItem[] = [
  // Core Framework
  techItem(
    'Next.js 16',
    'Framework',
    'App Router & Turbopack',
    'The most powerful React framework with built-in routing, SSR, and API routes.',
    '/images/stack/next-js.svg',
    'https://nextjs.org',
    'dark:invert',
  ),
  techItem(
    'Vercel',
    'Deployment',
    'Hosting & edge delivery',
    'Optimized platform for Next.js deployments with preview environments and global CDN.',
    '/images/stack/vercel.svg',
    'https://vercel.com',
    'dark:invert',
  ),
  techItem(
    'TypeScript',
    'Language',
    'Type-safe development',
    'Catch bugs before runtime and make refactoring safe.',
    '/images/stack/typescript.png',
    'https://typescriptlang.org',
  ),
  techItem(
    'Bun',
    'Runtime',
    'Fast runtime & package manager',
    '3x faster than npm. Built-in TypeScript support.',
    '/images/stack/bun.svg',
    'https://bun.sh',
  ),
  // Backend & Data
  techItem(
    'Convex',
    'Database',
    'Real-time backend',
    'Zero-config real-time database. No REST APIs or GraphQL boilerplate.',
    '/images/stack/convex.webp',
    'https://convex.dev',
  ),
  techItem(
    'Zod',
    'Validation',
    'Schema validation',
    'TypeScript-first validation with automatic type inference.',
    '/images/stack/zod.webp',
    'https://zod.dev',
  ),
  // Auth
  techItem(
    'WorkOS',
    'Auth',
    'Enterprise SSO & SCIM',
    'Enterprise-grade authentication. Land enterprise customers from day one.',
    '/images/stack/workos.png',
    'https://workos.com',
  ),
  // UI
  techItem(
    'shadcn/ui',
    'UI',
    'Beautiful components',
    'Copy-paste components that you own. Accessible and customizable.',
    '/images/stack/shadcn.png',
    'https://ui.shadcn.com',
  ),
  techItem(
    'Tailwind CSS',
    'Styling',
    'Utility-first CSS',
    'Ship faster with utility classes. Tiny production bundles.',
    '/images/stack/tailwind.png',
    'https://tailwindcss.com',
  ),
  techItem(
    'Animate UI',
    'Animations',
    'Smooth animations',
    'Production-ready animations that delight users.',
    '/images/stack/animate-ui.ico',
    'https://animate-ui.com',
  ),
  // Payments & Email
  techItem(
    'Stripe',
    'Payments',
    'Billing & subscriptions',
    'Connected to Convex for real-time subscription sync.',
    '/images/stack/sripe.png',
    'https://stripe.com',
  ),
  techItem(
    'Resend',
    'Email',
    'Transactional emails',
    'Modern email API with React components.',
    '/images/stack/resend.webp',
    'https://resend.com',
    'dark:invert',
  ),
  // State
  techItem(
    'TanStack Query',
    'State',
    'Server state management',
    'Automatic caching, background updates, and optimistic UI.',
    '/images/stack/tanstack.png',
    'https://tanstack.com/query',
  ),
  techItem(
    'nuqs',
    'State',
    'Type-safe URL params',
    'URL state that syncs with React. Shareable links.',
    '/images/stack/nuqs.jpg',
    'https://nuqs.47ng.com',
  ),
  // AI
  techItem(
    'OpenAI',
    'AI',
    'LLM integration',
    'Add AI features to your SaaS with a simple API.',
    '/images/stack/openai.webp',
    'https://openai.com',
    'dark:invert',
  ),
  techItem(
    'ElevenLabs',
    'AI Voice',
    'Voice and speech generation',
    'Add text-to-speech, voice agents, and audio experiences with the Convex component.',
    '/images/stack/elevenlabs.svg',
    'https://www.convex.dev/components/convex-elevenlabs',
    'dark:invert',
  ),
  techItem(
    'General Translation',
    'i18n',
    'AI-powered translations',
    'Translate your app with AI. No JSON files to maintain.',
    '/images/stack/gt.svg',
    'https://generaltranslation.com',
  ),
  techItem(
    'IndexNow',
    'SEO',
    'Instant content indexing',
    'Push updates directly to search engines so new pages and edits get discovered faster.',
    '/images/stack/indexnow.png',
    'https://www.indexnow.org',
  ),
  // Content
  techItem(
    'Sanity',
    'CMS',
    'Headless CMS',
    'Flexible content modeling for blogs and marketing pages.',
    '/images/stack/sanity.png',
    'https://sanity.io',
  ),
  // Analytics & Monitoring
  techItem(
    'DataFast',
    'Analytics',
    'Simple analytics',
    'Privacy-friendly analytics. Easy setup, no complexity.',
    '/images/stack/datafast.png',
    'https://datafa.st',
  ),
  techItem(
    'PostHog',
    'Monitoring',
    'Product analytics & logging',
    'Error tracking, session replay, and product analytics in one.',
    '/images/stack/posthog.png',
    'https://posthog.com',
  ),
  // Support
  techItem(
    'Onboarda',
    'Onboarding',
    'Guided product setup',
    'Help new customers reach activation faster with a clear onboarding flow and in-app guidance.',
    '/images/stack/onboarda.png',
  ),
  techItem(
    'AffiliateBase',
    'Growth',
    'Affiliate program management',
    'Launch referral and affiliate loops without building your own tracking and payout system.',
    '/images/stack/affiliatebase.png',
    'https://www.affiliatebase.io',
  ),
  techItem(
    'Cal.com',
    'Scheduling',
    'Instant booking links',
    'Let prospects book demos and discovery calls without back-and-forth emails.',
    '/images/stack/cal.png',
    'https://cal.com',
  ),
  // Code Quality
  techItem(
    'Knip',
    'Cleanup',
    'Find unused code',
    'Detect unused files and dependencies automatically.',
    '/images/stack/knip.svg',
    'https://knip.dev',
  ),
  techItem(
    'CodeRabbit',
    'Review',
    'AI code review',
    'Instant AI-powered reviews on every PR.',
    '/images/stack/coderabbit.png',
    'https://coderabbit.ai',
  ),
  techItem(
    'SonarCloud',
    'Quality',
    'Code analysis',
    'Continuous code quality and security analysis.',
    '/images/stack/sonarcloud.ico',
    'https://sonarcloud.io',
  ),
];
