'use client';

import { T } from 'gt-next';
import Link from 'next/link';

import { Fade } from '@/components/animate-ui/fade';
import { Slide } from '@/components/animate-ui/slide';
import { Button } from '@/components/ui/button';

export function CtaSection(): React.ReactElement {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Fade inView inViewOnce inViewMargin="-50px">
          <Slide direction="up" offset={15} inView inViewOnce inViewMargin="-50px">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <T id="landing.ctaTitle">Ready to ship faster?</T>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                <T id="landing.ctaDescription">Get started with Blueprint today and launch your SaaS in record time.</T>
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/login"><T id="landing.startBuilding">Start Building</T></Link>
                </Button>
              </div>
            </div>
          </Slide>
        </Fade>
      </div>
    </section>
  );
}
