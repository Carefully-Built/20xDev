'use client';


import { Fade } from '@/components/animate-ui/fade';
import { Slide } from '@/components/animate-ui/slide';
import { featureListItems } from '@/config/features';

const featureKeys = [
  'stripePayments',
  'internationalization',
  'realTimeDb',
  'transactionalEmail',
  'orgManagement',
  'ciCdPipeline',
] as const;

export function FeatureList(): React.ReactElement {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Fade inView inViewOnce inViewMargin="-50px">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything included
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No hidden fees, no missing features. Everything you need in one
              template.
            </p>
          </div>
        </Fade>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featureListItems.map((item, i) => {
            const key = featureKeys[i] ?? `item${String(i)}`;
            return (
              <Slide
                key={item.title}
                direction="up"
                delay={i * 100}
                inView
                inViewOnce
                inViewMargin="-50px"
              >
                <div className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Slide>
            );
          })}
        </div>
      </div>
    </section>
  );
}
