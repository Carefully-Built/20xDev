'use client';

import { T } from 'gt-next';

import { Fade } from '@/components/animate-ui/fade';

import { GenericFaqSection } from './generic-faq-section';
import type { FaqItemProps } from './faq-item';

const faqs: readonly FaqItemProps[] = [
  {
    question: <T id="faq.q1">What is Blueprint?</T>,
    answer: (
      <T id="faq.a1">
        Blueprint is a production-ready B2B SaaS starter kit built with Next.js
        15, Convex, and WorkOS. It provides everything you need to launch a
        modern SaaS application: authentication, organization management,
        real-time data, payments, and more.
      </T>
    ),
  },
  {
    question: <T id="faq.q2">Is Blueprint free to use?</T>,
    answer: (
      <T id="faq.a2">
        Blueprint is open source and free to use for any project. You only pay
        for the services you use (Convex, WorkOS, Stripe, etc.) based on their
        pricing tiers. Most have generous free tiers for getting started.
      </T>
    ),
  },
  {
    question: (
      <T id="faq.q3">Why WorkOS instead of other auth providers?</T>
    ),
    answer: (
      <T id="faq.a3">
        WorkOS provides enterprise-grade authentication with SSO, SCIM, and
        directory sync out of the box. This makes Blueprint ideal for B2B SaaS
        where your customers need to connect their identity providers.
      </T>
    ),
  },
  {
    question: (
      <T id="faq.q4">Can I use Blueprint for B2C applications?</T>
    ),
    answer: (
      <T id="faq.a4">
        While Blueprint is optimized for B2B with organization management and
        enterprise auth, you can adapt it for B2C use cases. The core
        architecture, real-time backend, and payment integration work great for
        any SaaS.
      </T>
    ),
  },
  {
    question: <T id="faq.q5">How does real-time data work?</T>,
    answer: (
      <T id="faq.a5">
        Convex provides automatic real-time subscriptions. When data changes in
        the database, all connected clients update instantly without any
        additional configuration. No WebSocket setup or state management
        required.
      </T>
    ),
  },
  {
    question: <T id="faq.q6">Is Blueprint production-ready?</T>,
    answer: (
      <T id="faq.a6">
        Yes! Blueprint includes production essentials: TypeScript for type
        safety, ESLint for code quality, proper error handling, secure
        authentication, and a scalable architecture. Deploy to Vercel with one
        click.
      </T>
    ),
  },
  {
    question: <T id="faq.q7">How do I customize the design?</T>,
    answer: (
      <T id="faq.a7">
        Blueprint uses Tailwind CSS and shadcn/ui components. Customize the
        theme in your CSS variables, or modify individual components. Everything
        is unstyled by default and designed to be extended.
      </T>
    ),
  },
  {
    question: (
      <T id="faq.q8">What about payments and subscriptions?</T>
    ),
    answer: (
      <T id="faq.a8">
        Blueprint integrates with Stripe for payments. Handle one-time charges,
        subscriptions, usage-based billing, and customer portals. Webhook
        handlers and billing state management are included.
      </T>
    ),
  },
];

export function FaqSection(): React.ReactElement {
  return (
    <Fade inView inViewOnce inViewMargin="-50px">
      <GenericFaqSection
        title={<T id="faq.title">Frequently asked questions</T>}
        description={
          <T id="faq.description">
            Everything you need to know about Blueprint.
          </T>
        }
        items={faqs}
      />
    </Fade>
  );
}
