import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export function CtaSection(): React.ReactElement {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to ship faster?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started with {siteConfig.name} today and launch your SaaS in record time.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/login">Start Building</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
