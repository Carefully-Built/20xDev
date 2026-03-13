export interface PricingFeature {
  readonly text: string;
  readonly included: boolean;
}

export interface PricingTier {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly monthlyPrice: number;
  readonly annualPrice: number;
  readonly features: readonly PricingFeature[];
  readonly cta: string;
  readonly ctaHref: string;
  readonly recommended: boolean;
}

export interface PricingFaqItem {
  readonly question: string;
  readonly answer: string;
}

export const pricingTiers: readonly PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For solo builders validating an idea and shipping the first version fast.',
    monthlyPrice: 19,
    annualPrice: 15,
    features: [
      { text: 'Up to 3 team members', included: true },
      { text: '1,000 API requests/mo', included: true },
      { text: 'Community support', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Custom domain', included: false },
      { text: 'Priority support', included: false },
      { text: 'SSO / SAML', included: false },
      { text: 'Audit logs', included: false },
    ],
    cta: 'Start with Starter',
    ctaHref: '/login',
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For small teams that need more capacity, collaboration, and support.',
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      { text: 'Up to 20 team members', included: true },
      { text: '50,000 API requests/mo', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Priority support', included: true },
      { text: 'SSO / SAML', included: false },
      { text: 'Audit logs', included: false },
    ],
    cta: 'Choose Pro',
    ctaHref: '/login',
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For larger organizations that need security controls, scale, and hands-on support.',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      { text: 'Unlimited team members', included: true },
      { text: 'Unlimited API requests', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Priority support', included: true },
      { text: 'SSO / SAML', included: true },
      { text: 'Audit logs', included: true },
    ],
    cta: 'Talk to Sales',
    ctaHref: '/contact',
    recommended: false,
  },
] as const;

export const pricingFaqs: readonly PricingFaqItem[] = [
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes. You can move to a different plan whenever your needs change. Upgrades apply immediately and downgrades take effect on the next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes. The Pro plan includes a 14-day trial so teams can evaluate the product before committing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept major credit and debit cards. Annual plans can also be paid by invoice for eligible teams.',
  },
  {
    question: 'What happens when I exceed my API limits?',
    answer:
      'We notify you before you hit your limit so you have time to upgrade. If you need more volume, you can move to a higher plan before service is interrupted.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes. You can cancel from your account settings at any time, and your access remains active until the end of the current billing period.',
  },
  {
    question: 'Do you offer discounts for startups or nonprofits?',
    answer:
      'We offer custom pricing for qualified startups, nonprofits, and larger teams with specific procurement requirements.',
  },
] as const;
