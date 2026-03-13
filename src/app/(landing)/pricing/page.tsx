import type { Metadata } from 'next';

import { PricingSection } from './_components/pricing-section';

export const metadata: Metadata = {
  title: 'Pricing - 20x Step',
  description:
    'Explore 20x Step pricing for solo builders, growing teams, and enterprise deployments.',
};

export default function PricingPage(): React.ReactElement {
  return <PricingSection />;
}
