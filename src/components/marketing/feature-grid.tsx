'use client';

import { T } from 'gt-next';

import { Fade } from '@/components/animate-ui/fade';
import { Slide } from '@/components/animate-ui/slide';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { featureGridItems } from '@/config/features';

const featureKeys = [
  'productionReady',
  'aiOptimized',
  'b2bReady',
  'modernStack',
  'enterpriseSecurity',
  'realTimeData',
] as const;

export function FeatureGrid(): React.ReactElement {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Fade inView inViewOnce inViewMargin="-50px">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <T id="featureGrid.title">Everything you need to ship</T>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              <T id="featureGrid.description">
                Stop rebuilding the same infrastructure. Start with a foundation
                that scales.
              </T>
            </p>
          </div>
        </Fade>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureGridItems.map((feature, i) => {
            const key = featureKeys[i] ?? `item${String(i)}`;
            return (
              <Slide
                key={feature.title}
                direction="up"
                delay={i * 100}
                inView
                inViewOnce
                inViewMargin="-50px"
              >
                <Card className="border-0 bg-muted/50 transition-colors hover:bg-muted">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      <T id={`featureGrid.${key}.title`}>
                        {feature.title}
                      </T>
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      <T id={`featureGrid.${key}.desc`}>
                        {feature.description}
                      </T>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Slide>
            );
          })}
        </div>
      </div>
    </section>
  );
}
