import type { Metadata } from 'next';

import { PricingSection } from './_components/pricing-section';

export const metadata: Metadata = {
  title: 'Pricing - Blueprint',
  description:
    'Simple, transparent pricing for Blueprint. Choose the plan that fits your team with monthly or annual billing options.',
};

export default function PricingPage(): React.ReactElement {
  return <PricingSection />;
}
