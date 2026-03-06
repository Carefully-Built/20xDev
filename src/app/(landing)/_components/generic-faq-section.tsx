'use client';

import { T } from 'gt-next';

import type { ReactNode } from 'react';

import { FaqItem, type FaqItemProps } from './faq-item';

interface GenericFaqSectionProps {
  readonly title: ReactNode;
  readonly description: ReactNode;
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
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="mt-12">
          {items.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            <T id="faq.stillHaveQuestions">Still have questions?</T>{' '}
            <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
              <T id="faq.contactUs">Contact us</T>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
