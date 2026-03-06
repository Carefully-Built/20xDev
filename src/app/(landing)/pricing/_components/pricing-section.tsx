'use client';

import { useState } from 'react';
import { T } from 'gt-next';

import { pricingTiers, pricingFaqs } from '@/config/pricing';

import { Fade } from '@/components/animate-ui/fade';
import { Slide } from '@/components/animate-ui/slide';
import { PricingCard } from '@/components/marketing/pricing-card';
import { PricingFaq } from '@/components/marketing/pricing-faq';
import { PricingToggle } from '@/components/marketing/pricing-toggle';

export function PricingSection(): React.ReactElement {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Fade inView inViewOnce inViewMargin="-50px">
            <Slide direction="up" offset={20}>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  <T id="pricing.label">Pricing</T>
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  <T id="pricing.title">Simple, transparent pricing</T>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  <T id="pricing.description">
                    Choose the plan that fits your team. All plans include a 14-day free trial.
                  </T>
                </p>
              </div>

              <div className="mt-8">
                <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {pricingTiers.map((tier) => (
                  <PricingCard key={tier.id} tier={tier} isAnnual={isAnnual} />
                ))}
              </div>
            </Slide>
          </Fade>
        </div>
      </section>

      <PricingFaq items={pricingFaqs} />
    </>
  );
}
