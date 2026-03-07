'use client';

import { T } from 'gt-next';
import Image from 'next/image';

import { Fade } from '@/components/animate-ui/fade';
import { Slide } from '@/components/animate-ui/slide';
import { featureWithImageItems } from '@/config/features';
import { cn } from '@/lib/utils';

const featureKeys = ['dashboard', 'auth', 'landing'] as const;

export function FeatureWithImage(): React.ReactElement {
  return (
    <section className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Fade inView inViewOnce inViewMargin="-50px">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              <T id="featureWithImage.subtitle">See it in action</T>
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              <T id="featureWithImage.title">Built for real products</T>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              <T id="featureWithImage.description">
                Every feature designed, tested, and ready for production use.
              </T>
            </p>
          </div>
        </Fade>

        <div className="mt-16 space-y-24">
          {featureWithImageItems.map((item, i) => (
            <Slide
              key={item.title}
              direction="up"
              delay={100}
              inView
              inViewOnce
              inViewMargin="-80px"
            >
              <div
                className={cn(
                  'flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16',
                  i % 2 === 1 && 'lg:flex-row-reverse'
                )}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">
                      <T id={`featureWithImage.${featureKeys[i]}.title`}>
                        {item.title}
                      </T>
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    <T id={`featureWithImage.${featureKeys[i]}.desc`}>
                      {item.description}
                    </T>
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl border bg-muted/50 shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={600}
                      height={400}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Slide>
          ))}
        </div>
      </div>
    </section>
  );
}
