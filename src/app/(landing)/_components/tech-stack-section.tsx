import Link from 'next/link';
import Image from 'next/image';

interface TechItem {
  readonly name: string;
  readonly description: string;
  readonly why: string;
  readonly logo: string;
  readonly href: string;
  readonly className?: string;
}

interface TechCategory {
  readonly title: string;
  readonly items: readonly TechItem[];
}

const techCategories: readonly TechCategory[] = [
  {
    title: 'Core Framework',
    items: [
      {
        name: 'Next.js 16',
        description: 'App Router & Server Actions',
        why: 'The most powerful React framework with built-in routing, SSR, and API routes. Turbopack makes development blazing fast.',
        logo: '/images/stack/next-js.svg',
        href: 'https://nextjs.org',
        className: 'dark:invert',
      },
      {
        name: 'TypeScript',
        description: 'Type-safe development',
        why: 'Catch bugs before runtime, get amazing autocomplete, and make refactoring safe. Essential for maintainable code.',
        logo: '/images/stack/typescript.png',
        href: 'https://typescriptlang.org',
      },
      {
        name: 'Bun',
        description: 'Fast runtime & package manager',
        why: '3x faster than npm/yarn. Built-in TypeScript support. One tool for everything.',
        logo: '/images/stack/bun.svg',
        href: 'https://bun.sh',
      },
    ],
  },
  {
    title: 'Backend & Data',
    items: [
      {
        name: 'Convex',
        description: 'Real-time backend',
        why: 'Zero-config real-time database with automatic caching. No more REST APIs or GraphQL boilerplate.',
        logo: '/images/stack/convex.webp',
        href: 'https://convex.dev',
      },
      {
        name: 'Zod',
        description: 'Schema validation',
        why: 'TypeScript-first validation with automatic type inference. One schema for frontend and backend.',
        logo: '/images/stack/zod.webp',
        href: 'https://zod.dev',
      },
    ],
  },
  {
    title: 'Authentication',
    items: [
      {
        name: 'WorkOS',
        description: 'Enterprise auth & SSO',
        why: 'Enterprise-grade SSO, SCIM, and directory sync out of the box. Land enterprise customers from day one.',
        logo: '/images/stack/workos.png',
        href: 'https://workos.com',
      },
    ],
  },
  {
    title: 'UI & Design',
    items: [
      {
        name: 'shadcn/ui',
        description: 'Beautiful components',
        why: 'Copy-paste components that you own. Accessible, customizable, and beautifully designed.',
        logo: '/images/stack/shadcn.png',
        href: 'https://ui.shadcn.com',
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first styling',
        why: 'Ship faster with utility classes. No context switching between files. Tiny production bundles.',
        logo: '/images/stack/tailwind.png',
        href: 'https://tailwindcss.com',
      },
      {
        name: 'Animate UI',
        description: 'Smooth animations',
        why: 'Production-ready animations that delight users. No complex animation code to maintain.',
        logo: '/images/stack/animate-ui.png',
        href: 'https://animate-ui.com',
      },
    ],
  },
  {
    title: 'Payments & Email',
    items: [
      {
        name: 'Stripe',
        description: 'Payments & billing',
        why: 'The gold standard for payments. Subscriptions, invoicing, and billing portal built-in.',
        logo: '/images/stack/sripe.png',
        href: 'https://stripe.com',
      },
      {
        name: 'Resend',
        description: 'Transactional emails',
        why: 'Modern email API with React components. Beautiful emails without the complexity.',
        logo: '/images/stack/resend.webp',
        href: 'https://resend.com',
        className: 'dark:invert',
      },
    ],
  },
  {
    title: 'State Management',
    items: [
      {
        name: 'TanStack Query',
        description: 'Server state management',
        why: 'Automatic caching, background updates, and optimistic UI. Clean separation of server and client state.',
        logo: '/images/stack/tanstack.png',
        href: 'https://tanstack.com/query',
      },
      {
        name: 'nuqs',
        description: 'Type-safe URL params',
        why: 'URL state that syncs with React. Shareable links, browser history, and SSR support.',
        logo: '/images/stack/nuqs.jpg',
        href: 'https://nuqs.47ng.com',
      },
    ],
  },
  {
    title: 'AI & Intelligence',
    items: [
      {
        name: 'OpenAI',
        description: 'LLM integration',
        why: 'Add AI features to your SaaS. GPT-4, embeddings, and more with a simple API.',
        logo: '/images/stack/openai.webp',
        href: 'https://openai.com',
        className: 'dark:invert',
      },
      {
        name: 'General Translation',
        description: 'AI-powered i18n',
        why: 'Translate your app with AI. No JSON files to maintain. Updates automatically.',
        logo: '/images/stack/gt.png',
        href: 'https://generaltranslation.com',
      },
    ],
  },
  {
    title: 'Content & Blog',
    items: [
      {
        name: 'Sanity',
        description: 'Headless CMS',
        why: 'Flexible content modeling with real-time collaboration. Perfect for blogs and marketing pages.',
        logo: '/images/stack/sanity.png',
        href: 'https://sanity.io',
      },
    ],
  },
  {
    title: 'Analytics & Monitoring',
    items: [
      {
        name: 'Plausible',
        description: 'Privacy-friendly analytics',
        why: 'Simple, privacy-first analytics. No cookies, GDPR compliant, and lightweight.',
        logo: '/images/stack/plausible.png',
        href: 'https://plausible.io',
      },
      {
        name: 'Sentry',
        description: 'Error tracking',
        why: 'Catch errors before users report them. Stack traces, breadcrumbs, and performance monitoring.',
        logo: '/images/stack/sentry.png',
        href: 'https://sentry.io',
      },
    ],
  },
  {
    title: 'Customer Support',
    items: [
      {
        name: 'Intercom',
        description: 'Live chat & support',
        why: 'Talk to customers in real-time. AI-powered responses and help center built-in.',
        logo: '/images/stack/intercom.png',
        href: 'https://intercom.com',
      },
      {
        name: 'Featurebase',
        description: 'Feature requests & docs',
        why: 'Let users vote on features and read documentation. Build what customers actually want.',
        logo: '/images/stack/featurebase.png',
        href: 'https://featurebase.app',
      },
    ],
  },
  {
    title: 'Code Quality',
    items: [
      {
        name: 'Prettier',
        description: 'Code formatting',
        why: 'Consistent code style without debates. Format on save and forget about it.',
        logo: '/images/stack/prettier.png',
        href: 'https://prettier.io',
      },
      {
        name: 'Knip',
        description: 'Find unused code',
        why: 'Automatically detect unused files, dependencies, and exports. Keep your codebase clean.',
        logo: '/images/stack/knip.png',
        href: 'https://knip.dev',
      },
      {
        name: 'CodeRabbit',
        description: 'AI code review',
        why: 'Get instant AI-powered code reviews on every PR. Catch issues before they merge.',
        logo: '/images/stack/coderabbit.png',
        href: 'https://coderabbit.ai',
      },
      {
        name: 'SonarCloud',
        description: 'Code quality analysis',
        why: 'Continuous code quality and security analysis. Maintain high standards automatically.',
        logo: '/images/stack/sonarcloud.png',
        href: 'https://sonarcloud.io',
      },
    ],
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
            Every tool carefully chosen for a reason. Modern, scalable, and designed to work together beautifully.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {techCategories.map((category) => (
            <div key={category.title}>
              <h3 className="mb-6 text-lg font-semibold text-muted-foreground">
                {category.title}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((tech) => (
                  <Link
                    key={tech.name}
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 rounded-xl border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-muted/50">
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className={`size-8 object-contain ${tech.className ?? ''}`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {tech.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tech.why}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
