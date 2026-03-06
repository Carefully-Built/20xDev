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
    description: 'Perfect for side projects and early-stage startups.',
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
    cta: 'Get Started',
    ctaHref: '/login',
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that need more power and flexibility.',
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
    cta: 'Start Free Trial',
    ctaHref: '/login',
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with advanced security and compliance needs.',
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
    cta: 'Contact Sales',
    ctaHref: '/contact',
    recommended: false,
  },
] as const;

export const pricingFaqs: readonly PricingFaqItem[] = [
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. If you upgrade mid-cycle, you will be charged a prorated amount.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! The Pro plan includes a 14-day free trial with full access to all features. No credit card required to start.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) and process payments securely through Stripe. Annual plans can also be paid via invoice.',
  },
  {
    question: 'What happens when I exceed my API limits?',
    answer:
      'We will notify you when you reach 80% of your limit. If you exceed it, additional requests are charged at a pay-as-you-go rate. You can also upgrade your plan at any time for higher limits.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Absolutely. You can cancel anytime from your account settings. Your access continues until the end of your current billing period. We do not offer refunds for partial months.',
  },
  {
    question: 'Do you offer discounts for startups or nonprofits?',
    answer:
      'Yes, we offer special pricing for qualifying startups and nonprofits. Contact our sales team to learn more about our discount programs.',
  },
] as const;
