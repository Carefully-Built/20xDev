'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  LayoutTemplate,
  MousePointerClick,
  ShieldCheck,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface ShowcaseItem {
  readonly id: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly description: string;
  readonly proof: string;
  readonly kicker: string;
  readonly preview: {
    readonly imageSrc: string;
    readonly imageAlt: string;
  };
}

const showcaseItems: ReadonlyArray<ShowcaseItem> = [
  {
    id: 'offers',
    icon: LayoutTemplate,
    title: 'Launch pages that sell the product in 5 seconds',
    description:
      'State what 20xdev helps teams do, who it is for, and why it beats stitching together another starter stack.',
    proof: 'If the promise is vague, qualified visitors leave before they ever compare features.',
    kicker: 'Message clarity',
    preview: {
      imageSrc: '/images/website/background.png',
      imageAlt: 'Homepage preview placeholder',
    },
  },
  {
    id: 'activation',
    icon: MousePointerClick,
    title: 'Show what happens after the click',
    description:
      'Make the next step obvious for high-intent buyers: start building, explore the stack, or see how quickly they can launch.',
    proof: 'People convert faster when the payoff after the click is concrete, not implied.',
    kicker: 'Friction reduction',
    preview: {
      imageSrc: '/images/website/background.avif',
      imageAlt: 'Product flow preview placeholder',
    },
  },
  {
    id: 'trust',
    icon: ShieldCheck,
    title: 'Answer the objections serious buyers already have',
    description:
      'Use this space to prove the stack is production-ready, opinionated where it matters, and built to save real implementation time.',
    proof: 'Strong claims without proof create curiosity, but not confidence.',
    kicker: 'Trust building',
    preview: {
      imageSrc: '/images/blog-placeholder.svg',
      imageAlt: 'Trust and proof placeholder image',
    },
  },
  {
    id: 'experiments',
    icon: BarChart3,
    title: 'Give each section one job in the sales journey',
    description:
      'Instead of stacking generic features, use the page to move visitors from attention to belief to action with less cognitive load.',
    proof: 'The best homepage sections do one persuasive job each, and do it clearly.',
    kicker: 'Conversion structure',
    preview: {
      imageSrc: '/images/website/background.png',
      imageAlt: 'Section structure placeholder image',
    },
  },
] as const;

function ShowcasePreview({ item }: { readonly item: ShowcaseItem }): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-[#e9e2d7] p-3 shadow-[0_28px_80px_rgba(61,45,31,0.12)] sm:p-4">
      <div className="overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/60">
        <img
          src={item.preview.imageSrc}
          alt={item.preview.imageAlt}
          className="h-[420px] w-full object-cover object-center sm:h-[520px]"
        />
      </div>
    </div>
  );
}

export function InteractiveShowcaseSection(): React.ReactElement {
  const defaultShowcaseItem = showcaseItems[0];

  if (!defaultShowcaseItem) {
    throw new Error('Interactive showcase items are required.');
  }

  const [activeId, setActiveId] = useState<ShowcaseItem['id']>(defaultShowcaseItem.id);
  const activeItem = showcaseItems.find((item) => item.id === activeId) ?? defaultShowcaseItem;

  return (
    <section className="bg-[color:var(--landing-surface)] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-black/6 bg-white/55 px-4 py-1.5 text-sm tracking-[-0.02em] text-[color:var(--landing-ink)]">
              Why buyers convert
            </div>
            <h2 className="mt-6 max-w-3xl text-[2.75rem] leading-[0.98] font-medium tracking-[-0.065em] text-[color:var(--landing-ink)] sm:text-[3.45rem]">
              Launch your B2B SaaS faster, with the polish and trust signals buyers expect.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 tracking-[-0.03em] text-[color:var(--landing-muted)]">
              Built for indie hackers who want to skip the boilerplate, look legit from day one,
              and turn early traffic into signups instead of rebuild work.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 self-start rounded-full border border-black/12 px-5 text-[1rem] tracking-[-0.03em] text-[color:var(--landing-ink)] transition-colors hover:bg-white/55"
          >
            Start building
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_29rem] lg:items-center xl:gap-20">
          <ShowcasePreview item={activeItem} />

          <div className="space-y-3">
            {showcaseItems.map((item) => {
              const isActive = item.id === activeItem.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    'w-full rounded-[1.35rem] border px-5 py-4 text-left transition-all duration-200',
                    isActive
                      ? 'border-transparent bg-[color:var(--landing-panel)] shadow-[0_20px_50px_rgba(44,34,24,0.08)]'
                      : 'border-transparent bg-transparent hover:border-black/6 hover:bg-white/28'
                  )}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                        isActive ? 'bg-white/72 text-[color:var(--landing-ink)]' : 'bg-white/44 text-black/75'
                      )}
                    >
                      <item.icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[1.15rem] leading-7 font-medium tracking-[-0.04em] text-[color:var(--landing-ink)]">
                        {item.title}
                      </p>
                      <div
                        className={cn(
                          'grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-200',
                          isActive ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="text-[0.98rem] leading-7 tracking-[-0.02em] text-black/65">
                            {item.description}
                          </p>
                          <p className="mt-3 text-sm tracking-[-0.02em] text-[color:var(--landing-accent-strong)]">
                            {item.kicker}: {item.proof}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
