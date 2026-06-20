'use client';

import { T } from 'gt-next';
import Link from 'next/link';
import { isValidElement } from 'react';

import { FaqItem, type FaqItemProps } from './faq-item';
import { LandingSectionHeading } from './landing-section-heading';

interface GenericFaqSectionProps {
  readonly title: React.ReactNode;
  readonly description: React.ReactNode;
  readonly items: readonly FaqItemProps[];
}

function getNodeText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }

  if (isValidElement<{ readonly children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }

  return '';
}

function getFaqItemKey(item: FaqItemProps): string {
  return `${getNodeText(item.question)}:${getNodeText(item.answer)}`;
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
          {items.map((item) => (
            <FaqItem key={getFaqItemKey(item)} question={item.question} answer={item.answer} />
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
