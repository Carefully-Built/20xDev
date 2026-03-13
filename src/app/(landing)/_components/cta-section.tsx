import Link from 'next/link';

import { LandingSectionHeading } from './landing-section-heading';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export function CtaSection(): React.ReactElement {
  return (
    <section className="border-t border-black/6 bg-[color:var(--landing-surface)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/6 bg-white/78 px-8 py-12 text-center shadow-[0_20px_60px_rgba(34,26,20,0.06)] sm:px-12">
          <LandingSectionHeading
            title="Ready to ship faster?"
            description={`Get started with ${siteConfig.name} today and launch your SaaS in record time.`}
          />
          <div className="mt-8">
            <Button
              size="lg"
              className="rounded-full bg-[#160f0c] px-5 text-[1rem] font-medium tracking-[-0.02em] text-white hover:bg-[#2b1f1a]"
              asChild
            >
              <Link href="/login">Start Building</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
