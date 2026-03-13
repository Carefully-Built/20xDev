import Link from 'next/link';

import { LandingSectionHeading } from './landing-section-heading';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

const heroLandscape = 'https://www.figma.com/api/mcp/asset/7d573e88-b211-4bb6-baa0-3df2e75aa9d2';

export function HeroSection(): React.ReactElement {
  return (
    <section data-landing-hero className="relative overflow-hidden border-b border-black/6">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroLandscape}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top saturate-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,231,0.02)_0%,rgba(247,241,231,0.02)_38%,rgba(247,241,231,0.18)_58%,rgba(247,241,231,0.62)_82%,#f7f1e7_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-end px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center rounded-full border border-black/8 bg-white/68 px-4 py-1.5 text-sm font-medium tracking-[-0.02em] text-[color:var(--landing-ink)] shadow-[0_10px_30px_rgba(45,32,50,0.08)] backdrop-blur-sm">
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
                className="min-w-40 rounded-full bg-[#160f0c] px-5 text-[1rem] font-medium tracking-[-0.02em] text-white shadow-none hover:bg-[#2b1f1a]"
                asChild
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <p className="text-center text-sm tracking-[-0.02em] text-black/50">
          Trusted by developers building the next generation of SaaS
        </p>
      </div>
    </section>
  );
}
