'use client';

import { GenericFaqSection } from './generic-faq-section';
import type { FaqItemProps } from './faq-item';

import { siteConfig } from '@/config/site';

const faqs: readonly FaqItemProps[] = [
  {
    question: `What is ${siteConfig.name}?`,
    answer:
      `${siteConfig.name} is a production-ready B2B SaaS starter kit built with Next.js 15, Convex, and WorkOS. It provides everything you need to launch a modern SaaS application: authentication, organization management, real-time data, payments, and more.`,
  },
  {
    question: `Is ${siteConfig.name} free to use?`,
    answer:
      `${siteConfig.name} is open source and free to use for any project. You only pay for the services you use (Convex, WorkOS, Stripe, etc.) based on their pricing tiers. Most have generous free tiers for getting started.`,
  },
  {
    question: 'Why WorkOS instead of other auth providers?',
    answer:
      `WorkOS provides enterprise-grade authentication with SSO, SCIM, and directory sync out of the box. This makes ${siteConfig.name} ideal for B2B SaaS where your customers need to connect their identity providers.`,
  },
  {
    question: `Can I use ${siteConfig.name} for B2C applications?`,
    answer:
      `While ${siteConfig.name} is optimized for B2B with organization management and enterprise auth, you can adapt it for B2C use cases. The core architecture, real-time backend, and payment integration work great for any SaaS.`,
  },
  {
    question: 'How does real-time data work?',
    answer:
      'Convex provides automatic real-time subscriptions. When data changes in the database, all connected clients update instantly without any additional configuration. No WebSocket setup or state management required.',
  },
  {
    question: `Is ${siteConfig.name} production-ready?`,
    answer:
      `Yes! ${siteConfig.name} includes production essentials: TypeScript for type safety, ESLint for code quality, proper error handling, secure authentication, and a scalable architecture. Deploy to Vercel with one click.`,
  },
  {
    question: 'How do I customize the design?',
    answer:
      `${siteConfig.name} uses Tailwind CSS and shadcn/ui components. Customize the theme in your CSS variables, or modify individual components. Everything is unstyled by default and designed to be extended.`,
  },
  {
    question: 'What about payments and subscriptions?',
    answer:
      `${siteConfig.name} integrates with Stripe for payments. Handle one-time charges, subscriptions, usage-based billing, and customer portals. Webhook handlers and billing state management are included.`,
  },
];

export function FaqSection(): React.ReactElement {
  return (
    <GenericFaqSection
      title="Frequently asked questions"
      description={`Everything you need to know about ${siteConfig.name}.`}
      items={faqs}
    />
  );
}
