import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';

interface TechItem {
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly why: string;
  readonly logo: string;
  readonly href: string;
  readonly className?: string;
}

const techStack: readonly TechItem[] = [
  // Core Framework
  {
    name: 'Next.js 16',
    category: 'Framework',
    description: 'App Router & Turbopack',
    why: 'The most powerful React framework with built-in routing, SSR, and API routes.',
    logo: '/images/stack/next-js.svg',
    href: 'https://nextjs.org',
    className: 'dark:invert',
  },
  {
    name: 'TypeScript',
    category: 'Language',
    description: 'Type-safe development',
    why: 'Catch bugs before runtime and make refactoring safe.',
    logo: '/images/stack/typescript.png',
    href: 'https://typescriptlang.org',
  },
  {
    name: 'Bun',
    category: 'Runtime',
    description: 'Fast runtime & package manager',
    why: '3x faster than npm. Built-in TypeScript support.',
    logo: '/images/stack/bun.svg',
    href: 'https://bun.sh',
  },
  // Backend & Data
  {
    name: 'Convex',
    category: 'Database',
    description: 'Real-time backend',
    why: 'Zero-config real-time database. No REST APIs or GraphQL boilerplate.',
    logo: '/images/stack/convex.webp',
    href: 'https://convex.dev',
  },
  {
    name: 'Zod',
    category: 'Validation',
    description: 'Schema validation',
    why: 'TypeScript-first validation with automatic type inference.',
    logo: '/images/stack/zod.webp',
    href: 'https://zod.dev',
  },
  // Auth
  {
    name: 'WorkOS',
    category: 'Auth',
    description: 'Enterprise SSO & SCIM',
    why: 'Enterprise-grade authentication. Land enterprise customers from day one.',
    logo: '/images/stack/workos.png',
    href: 'https://workos.com',
  },
  // UI
  {
    name: 'shadcn/ui',
    category: 'UI',
    description: 'Beautiful components',
    why: 'Copy-paste components that you own. Accessible and customizable.',
    logo: '/images/stack/shadcn.png',
    href: 'https://ui.shadcn.com',
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    description: 'Utility-first CSS',
    why: 'Ship faster with utility classes. Tiny production bundles.',
    logo: '/images/stack/tailwind.png',
    href: 'https://tailwindcss.com',
  },
  {
    name: 'Animate UI',
    category: 'Animations',
    description: 'Smooth animations',
    why: 'Production-ready animations that delight users.',
    logo: '/images/stack/animate-ui.ico',
    href: 'https://animate-ui.com',
  },
  // Payments & Email
  {
    name: 'Stripe',
    category: 'Payments',
    description: 'Billing & subscriptions',
    why: 'Connected to Convex for real-time subscription sync.',
    logo: '/images/stack/sripe.png',
    href: 'https://stripe.com',
  },
  {
    name: 'Resend',
    category: 'Email',
    description: 'Transactional emails',
    why: 'Modern email API with React components.',
    logo: '/images/stack/resend.webp',
    href: 'https://resend.com',
    className: 'dark:invert',
  },
  // State
  {
    name: 'TanStack Query',
    category: 'State',
    description: 'Server state management',
    why: 'Automatic caching, background updates, and optimistic UI.',
    logo: '/images/stack/tanstack.png',
    href: 'https://tanstack.com/query',
  },
  {
    name: 'nuqs',
    category: 'State',
    description: 'Type-safe URL params',
    why: 'URL state that syncs with React. Shareable links.',
    logo: '/images/stack/nuqs.jpg',
    href: 'https://nuqs.47ng.com',
  },
  // AI
  {
    name: 'OpenAI',
    category: 'AI',
    description: 'LLM integration',
    why: 'Add AI features to your SaaS with a simple API.',
    logo: '/images/stack/openai.webp',
    href: 'https://openai.com',
    className: 'dark:invert',
  },
  {
    name: 'General Translation',
    category: 'i18n',
    description: 'AI-powered translations',
    why: 'Translate your app with AI. No JSON files to maintain.',
    logo: '/images/stack/gt.svg',
    href: 'https://generaltranslation.com',
  },
  // Content
  {
    name: 'Sanity',
    category: 'CMS',
    description: 'Headless CMS',
    why: 'Flexible content modeling for blogs and marketing pages.',
    logo: '/images/stack/sanity.png',
    href: 'https://sanity.io',
  },
  // Analytics & Monitoring
  {
    name: 'DataFast',
    category: 'Analytics',
    description: 'Simple analytics',
    why: 'Privacy-friendly analytics. Easy setup, no complexity.',
    logo: '/images/stack/datafast.png',
    href: 'https://datafa.st',
  },
  {
    name: 'PostHog',
    category: 'Monitoring',
    description: 'Product analytics & logging',
    why: 'Error tracking, session replay, and product analytics in one.',
    logo: '/images/stack/posthog.png',
    href: 'https://posthog.com',
  },
  // Support
  {
    name: 'Featurebase',
    category: 'Feedback',
    description: 'Feature requests & docs',
    why: 'Let users vote on features. Build what customers want.',
    logo: '/images/stack/featurebase.png',
    href: 'https://featurebase.app',
  },
  // Code Quality
  {
    name: 'Knip',
    category: 'Cleanup',
    description: 'Find unused code',
    why: 'Detect unused files and dependencies automatically.',
    logo: '/images/stack/knip.svg',
    href: 'https://knip.dev',
  },
  {
    name: 'CodeRabbit',
    category: 'Review',
    description: 'AI code review',
    why: 'Instant AI-powered reviews on every PR.',
    logo: '/images/stack/coderabbit.png',
    href: 'https://coderabbit.ai',
  },
  {
    name: 'SonarCloud',
    category: 'Quality',
    description: 'Code analysis',
    why: 'Continuous code quality and security analysis.',
    logo: '/images/stack/sonarcloud.ico',
    href: 'https://sonarcloud.io',
  },
];

export function TechStackSection(): React.ReactElement {
  return (
    <section className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Built with the best
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            The perfect stack for AI-generated B2B SaaS
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every tool carefully chosen for a reason. Modern, scalable, and designed to work together.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech) => (
            <Link
              key={tech.name}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-xl border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-muted/50">
                  <SafeImage
                    src={tech.logo}
                    alt={tech.name}
                    width={32}
                    height={32}
                    className={`size-8 ${tech.className ?? ''}`}
                  />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {tech.category}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-primary transition-colors">
                  {tech.name}
                </h4>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {tech.why}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
