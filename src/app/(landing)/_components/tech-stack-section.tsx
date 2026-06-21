'use client';

import { useState } from 'react';
import Link from 'next/link';

import { LandingSectionHeading } from './landing-section-heading';

import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/safe-image';

import { techStack, type TechItem } from './tech-stack-data';
export function TechStackSection(): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="border-t border-black/6 bg-[color:var(--landing-panel)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeading
          eyebrow="Built with the best"
          title="The perfect stack for AI-generated B2B SaaS"
          description="Every tool carefully chosen for a reason. Modern, scalable, and designed to work together."
          className="mx-auto max-w-3xl"
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech, index) => (
            <TechStackCard
              key={tech.name}
              tech={tech}
              className={getCollapsedVisibleClass(index, isExpanded)}
            />
          ))}
        </div>

        {techStack.length > 9 ? (
          <div className="relative mt-4">
            <div
              className={
                isExpanded
                  ? 'hidden'
                  : 'pointer-events-none max-h-44 overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_40%,transparent_100%)]'
              }
            >
              <div className="grid scale-[0.985] gap-4 opacity-60 blur-[1.5px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {techStack.map((tech, index) => (
                  <TechStackCard
                    key={`${tech.name}-preview`}
                    tech={tech}
                    className={getCollapsedPreviewClass(index)}
                  />
                ))}
              </div>
            </div>

            {!isExpanded ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[color:var(--landing-panel)] via-[color:var(--landing-panel)]/88 to-transparent" />
            ) : null}

            <div
              className={`flex ${isExpanded ? 'mt-6' : 'absolute inset-x-0 bottom-0 z-10 justify-center pb-3'}`}
            >
              <button
                type="button"
                onClick={() => setIsExpanded((current) => !current)}
                className="rounded-full border border-black/10 bg-white/92 px-5 py-2 text-sm font-medium tracking-[-0.02em] text-[color:var(--landing-ink)] shadow-[0_12px_30px_rgba(42,34,28,0.08)] transition hover:border-[color:var(--landing-accent-strong)]/30 hover:text-[color:var(--landing-accent-strong)]"
              >
                {isExpanded ? 'Show fewer tools' : `Show all ${techStack.length} tools`}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TechStackCard({
  tech,
  className = '',
}: {
  readonly tech: TechItem;
  readonly className?: string;
}): React.ReactElement {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden">
          <SafeImage
            src={tech.logo}
            alt={tech.name}
            width={32}
            height={32}
            className={`size-8 ${tech.className?.replace('dark:invert', '').trim() ?? ''}`}
          />
        </div>
        <Badge variant="secondary" className="border-0 bg-black/5 text-xs text-black/65">
          {tech.category}
        </Badge>
      </div>
      <div>
        <h4 className="font-semibold tracking-[-0.03em] text-[color:var(--landing-ink)] transition-colors group-hover:text-[color:var(--landing-accent-strong)]">
          {tech.name}
        </h4>
        <p className="text-sm text-black/58">{tech.description}</p>
      </div>
      <p className="text-sm leading-relaxed text-black/48">{tech.why}</p>
    </>
  );

  const classes = `group flex flex-col gap-3 rounded-[1.5rem] border border-black/6 bg-white/78 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--landing-accent-strong)]/25 hover:shadow-[0_20px_45px_rgba(42,34,28,0.08)] ${className}`;

  if (tech.href) {
    return (
      <Link href={tech.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

function getCollapsedVisibleClass(index: number, isExpanded: boolean): string {
  if (isExpanded) {
    return '';
  }

  if (index < 2) {
    return '';
  }

  if (index < 4) {
    return 'hidden sm:flex';
  }

  if (index < 6) {
    return 'hidden lg:flex';
  }

  if (index < 8) {
    return 'hidden xl:flex';
  }

  return 'hidden';
}

function getCollapsedPreviewClass(index: number): string {
  if (index < 2) {
    return 'hidden';
  }

  if (index < 4) {
    return 'flex sm:hidden';
  }

  if (index < 6) {
    return 'flex lg:hidden';
  }

  if (index < 8) {
    return 'flex xl:hidden';
  }

  return 'flex';
}
