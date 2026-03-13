import Link from 'next/link';

import { LandingSectionHeading } from './landing-section-heading';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

const heroLandscape = '/images/website/background.avif';

export function HeroSection(): React.ReactElement {
  return (
    <section className="relative min-h-screen overflow-hidden border-b border-black/6">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroLandscape}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,231,0)_0%,rgba(247,241,231,0)_55%,rgba(247,241,231,0.32)_74%,rgba(247,241,231,0.78)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-20 pt-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="w-full">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center rounded-full border border-white/25 bg-[rgba(27,6,36,0.62)] px-4 py-1.5 text-sm font-medium tracking-[-0.02em] text-white shadow-[0_10px_30px_rgba(45,32,50,0.14)] backdrop-blur-sm">
              Now in public beta
            </div>

            <LandingSectionHeading
              hero
              title="Ship beautiful B2B SaaS in hours, not months"
              description={siteConfig.description}
              titleClassName="max-w-4xl"
              descriptionClassName="max-w-2xl"
            />

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="min-w-40 rounded-full bg-[#160f0c] px-7 text-[1rem] font-medium tracking-[-0.02em] text-white shadow-none hover:bg-[#2b1f1a]"
                asChild
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
