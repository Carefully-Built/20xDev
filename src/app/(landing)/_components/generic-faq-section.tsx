'use client';

import { T } from 'gt-next';
import Link from 'next/link';

import { FaqItem, type FaqItemProps } from './faq-item';
import { LandingSectionHeading } from './landing-section-heading';

interface GenericFaqSectionProps {
  readonly title: React.ReactNode;
  readonly description: React.ReactNode;
  readonly items: readonly FaqItemProps[];
}

export function GenericFaqSection({
  title,
  description,
  items,
}: GenericFaqSectionProps): React.ReactElement {
  return (
    <section className="bg-[color:var(--landing-surface)] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeading
          eyebrow="FAQ"
          title={title}
          description={description}
          className="mx-auto max-w-3xl"
        />

        <div className="mt-12">
          {items.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-black/58">
            <T>Still have questions?</T>{' '}
            <Link
              href="/contact"
              className="font-medium text-[color:var(--landing-accent-strong)] hover:underline"
            >
              <T>Contact us</T>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
