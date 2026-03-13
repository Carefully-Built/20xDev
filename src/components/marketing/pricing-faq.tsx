'use client';


import type { PricingFaqItem } from '@/config/pricing';

import { GenericFaqSection } from '@/app/(landing)/_components/generic-faq-section';
import type { FaqItemProps } from '@/app/(landing)/_components/faq-item';

interface PricingFaqProps {
  readonly items: readonly PricingFaqItem[];
}

export function PricingFaq({ items }: PricingFaqProps): React.ReactElement {
  const faqItems: readonly FaqItemProps[] = items.map((item, index) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <GenericFaqSection
      title="Pricing FAQ"
      description={
        <>
          Common questions about our pricing and billing.
        </>
      }
      items={faqItems}
    />
  );
}
