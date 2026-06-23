/**
 * Pricing Configuration
 *
 * Data-driven pricing so a fork (or automation) can change the offer without
 * editing the pricing page JSX. Defaults preserve the current 20xdev launch
 * deal exactly. Shaped as a `plans` array so it can represent either a single
 * one-time deal (current) or multiple recurring tiers later.
 */

export interface PricingCta {
  readonly label: string;
  readonly href: string;
}

export interface PricingPlan {
  readonly id: string;
  readonly label: string;
  readonly priceLabel: string;
  readonly period: string;
  readonly inclusions: readonly string[];
  readonly primaryCta: PricingCta;
  readonly secondaryCta?: PricingCta;
}

export interface PricingConfig {
  readonly badge: string;
  readonly plans: readonly PricingPlan[];
}

const lifetimePlan: PricingPlan = {
  id: 'lifetime',
  label: 'Lifetime access',
  priceLabel: '79€',
  period: 'one-time payment',
  inclusions: [
    'Full source code for the starter',
    'Auth, organizations, dashboard, files, and billing foundations',
    'Built-in stack for shipping B2B SaaS faster',
    'One-time payment, no subscription',
  ],
  primaryCta: { label: 'Get the 79€ deal', href: '/contact' },
  secondaryCta: { label: 'Open the product', href: '/login' },
};

export const pricingConfig: PricingConfig = {
  badge: 'Temporary pricing',
  plans: [lifetimePlan],
};

/** The plan rendered as the headline offer. */
export const featuredPlan: PricingPlan = lifetimePlan;
