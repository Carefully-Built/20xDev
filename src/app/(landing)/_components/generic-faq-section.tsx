'use client';

import { FaqItem, type FaqItemProps } from './faq-item';
import { LandingSectionHeading } from './landing-section-heading';

interface GenericFaqSectionProps {
  readonly title: string;
  readonly description: string;
  readonly items: readonly FaqItemProps[];
  readonly contactEmail?: string;
}

export function GenericFaqSection({
  title,
  description,
  items,
  contactEmail = 'support@blueprint.dev',
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
          {items.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-black/58">
            Still have questions?{' '}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-[color:var(--landing-accent-strong)] hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
