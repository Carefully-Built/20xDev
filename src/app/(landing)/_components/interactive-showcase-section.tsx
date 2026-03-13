'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import lottie, { type AnimationItem } from 'lottie-web';
import { ArrowRight, BarChart3, Bot, Smartphone, SquarePen } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ShowcaseItem {
  readonly id: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly description: string;
  readonly proof: string;
  readonly kicker: string;
  readonly preview: {
    readonly animationSrc: string;
    readonly animationLabel: string;
    readonly zoom?: number;
    readonly edgeToEdge?: boolean;
    readonly transformOrigin?: string;
    readonly preserveAspectRatio?: string;
  };
}

const showcaseItems: ReadonlyArray<ShowcaseItem> = [
  {
    id: 'blog',
    icon: SquarePen,
    title: 'SEO-ready blog already built in',
    description:
      'Start publishing from day one with the blog already set up, so you can focus on ranking, writing, and compounding organic traffic.',
    proof: 'No extra setup, no separate content project, no delay before SEO starts working.',
    kicker: 'Content and SEO',
    preview: {
      animationSrc: '/images/website/lottie/blog.json',
      animationLabel: 'SEO-ready blog animation',
      zoom: 1,
      transformOrigin: 'center',
      preserveAspectRatio: 'xMidYMid meet',
    },
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile-first across the whole product',
    description:
      'The project is designed for mobile from the start, with responsive tables, bottom sheets, and interaction patterns that feel native on smaller screens.',
    proof: 'You are not patching mobile later. The UX is already thought through for it.',
    kicker: 'Mobile UX',
    preview: {
      animationSrc: '/images/website/lottie/mobile.json',
      animationLabel: 'Mobile-first product animation',
      zoom: 1,
      transformOrigin: 'center',
      preserveAspectRatio: 'xMidYMid meet',
    },
  },
  {
    id: 'charts',
    icon: BarChart3,
    title: 'Charts are already wired into the dashboard',
    description:
      'Use ready-made chart components in the dashboard instead of spending time setting up the basics before you can show meaningful product data.',
    proof: 'You can move straight to your own metrics instead of building the chart layer first.',
    kicker: 'Dashboard foundation',
    preview: {
      animationSrc: '/images/website/lottie/charts.json',
      animationLabel: 'Dashboard charts animation',
      zoom: 1,
      transformOrigin: 'center',
      preserveAspectRatio: 'xMidYMid meet',
    },
  },
  {
    id: 'ai',
    icon: Bot,
    title: 'AI is already part of the foundation',
    description:
      'If you want to add AI features, the project already gives you a clean starting point instead of forcing you to bolt that layer on later.',
    proof: 'Less integration work up front means you can ship AI workflows sooner.',
    kicker: 'AI-ready stack',
    preview: {
      animationSrc: '/images/website/lottie/ai.json',
      animationLabel: 'AI-ready project animation',
      zoom: 1,
      edgeToEdge: true,
      transformOrigin: 'top left',
      preserveAspectRatio: 'xMinYMin slice',
    },
  },
] as const;

function LottiePreview({ item }: { readonly item: ShowcaseItem }): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const animation: AnimationItem = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: item.preview.animationSrc,
      rendererSettings: {
        preserveAspectRatio: item.preview.preserveAspectRatio ?? 'xMidYMid meet',
      },
    });

    return () => {
      animation.destroy();
    };
  }, [item.preview.animationSrc]);

  return (
    <div
      className={cn(
        'h-[320px] w-full overflow-hidden sm:h-[420px] lg:h-[520px]',
        item.preview.edgeToEdge ? 'rounded-[1.6rem]' : 'rounded-[1.2rem]'
      )}
    >
      <div
        ref={containerRef}
        aria-label={item.preview.animationLabel}
        role="img"
        className="h-full w-full"
        style={{
          transform: `scale(${item.preview.zoom ?? 1})`,
          transformOrigin: item.preview.transformOrigin ?? 'center',
        }}
      />
    </div>
  );
}

function ShowcasePreview({ item }: { readonly item: ShowcaseItem }): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-[#e9e2d7] p-3 shadow-[0_28px_80px_rgba(61,45,31,0.12)] sm:p-4">
      <div
        className={cn(
          'overflow-hidden rounded-[1.6rem] border border-black/6 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(240,231,219,0.9)_36%,rgba(225,213,198,0.92)_100%)]',
          item.preview.edgeToEdge ? 'p-0' : 'p-4 sm:p-6'
        )}
      >
        <LottiePreview item={item} />
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
              Built in from day one
            </div>
            <h2 className="mt-6 max-w-3xl text-[2.75rem] leading-[0.98] font-medium tracking-[-0.065em] text-[color:var(--landing-ink)] sm:text-[3.45rem]">
              Start with the parts indie hackers usually spend weeks stitching together.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 tracking-[-0.03em] text-[color:var(--landing-muted)]">
              Blog, mobile UX, charts, and AI readiness are already in place, so you can spend
              more time shipping your product and less time building the foundation around it.
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
                      ? 'border-[color:var(--landing-accent-strong)]/28 bg-white/72 shadow-[0_20px_50px_rgba(44,34,24,0.08)] ring-1 ring-[color:var(--landing-accent-strong)]/10'
                      : 'border-transparent bg-transparent hover:border-black/8 hover:bg-white/28'
                  )}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                        isActive
                          ? 'bg-[color:var(--landing-panel)] text-[color:var(--landing-accent-strong)]'
                          : 'bg-white/44 text-black/75'
                      )}
                    >
                      <item.icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-[1.15rem] leading-7 font-medium tracking-[-0.04em] text-[color:var(--landing-ink)]',
                          isActive && 'text-[color:var(--landing-accent-strong)]'
                        )}
                      >
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
