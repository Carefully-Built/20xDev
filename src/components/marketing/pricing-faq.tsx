'use client';

import { T } from 'gt-next';

import type { PricingFaqItem } from '@/config/pricing';

import { GenericFaqSection } from '@/app/(landing)/_components/generic-faq-section';
import type { FaqItemProps } from '@/app/(landing)/_components/faq-item';

interface PricingFaqProps {
  readonly items: readonly PricingFaqItem[];
}

export function PricingFaq({ items }: PricingFaqProps): React.ReactElement {
  const faqItems: readonly FaqItemProps[] = items.map((item, index) => ({
    question: <T id={`pricing.faq.q${index + 1}`}>{item.question}</T>,
    answer: <T id={`pricing.faq.a${index + 1}`}>{item.answer}</T>,
  }));

  return (
    <GenericFaqSection
      title={<T id="pricing.faq.title">Pricing FAQ</T>}
      description={
        <T id="pricing.faq.description">
          Common questions about our pricing and billing.
        </T>
      }
      items={faqItems}
    />
  );
}
