import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

const heroLandscape = '/images/website/background.avif';

const inclusions = [
  'Full source code for the starter',
  'Auth, organizations, dashboard, files, and billing foundations',
  'Built-in stack for shipping B2B SaaS faster',
  'One-time payment, no subscription',
] as const;

export const metadata: Metadata = {
  title: `Pricing - ${siteConfig.name}`,
  description: `Temporary pricing for ${siteConfig.name}: lifetime deal access for 79€.`,
};

export default function PricingPage(): React.ReactElement {
  return (
    <section className="relative overflow-hidden border-b border-black/6">
      <PricingBackground />

      <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-24 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pt-[23rem]">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 lg:gap-16">
          <header className="mx-auto max-w-[44rem] text-center">
            <div className="inline-flex items-center rounded-full border border-[#d9cebf] bg-[rgba(255,255,255,0.72)] px-4 py-1.5 text-[0.82rem] font-medium tracking-[0.01em] text-[#5f5751] shadow-[0_10px_30px_rgba(45,32,50,0.06)] backdrop-blur-sm">
              Temporary pricing
            </div>
            <h1 className="mt-6 text-[clamp(3rem,7vw,4.7rem)] leading-[0.94] font-normal tracking-[-0.07em] text-[#222221]">
              One lifetime deal.
              <br />
              79€ and you are in.
            </h1>
            <p className="mx-auto mt-5 max-w-[36rem] text-[1.05rem] leading-7 tracking-[-0.03em] text-[#5f5751]/90 sm:text-[1.16rem]">
              For now, {siteConfig.name} is available as a simple one-time purchase. No tiers, no
              recurring plan, just the full starter at a temporary launch price.
            </p>
          </header>

          <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-[#ddd4c9] bg-[rgba(255,255,255,0.62)] p-7 shadow-[0_18px_50px_rgba(64,42,30,0.08)] backdrop-blur-md sm:p-8">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 border-b border-[#e2d9ce] pb-7">
                  <p className="text-[0.82rem] font-medium tracking-[0.08em] text-[#7c7068] uppercase">
                    Lifetime access
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="text-[clamp(3.8rem,9vw,5.6rem)] leading-none font-normal tracking-[-0.08em] text-[#1e1916]">
                      79€
                    </div>
                    <p className="pb-2 text-[1rem] leading-7 tracking-[-0.02em] text-[#6b615a]">
                      one-time payment
                    </p>
                  </div>
                  <p className="max-w-[34rem] text-[1rem] leading-7 tracking-[-0.025em] text-[#5f5751]/90">
                    A temporary pricing page for early buyers. This offer gives access to the full
                    starter and is intentionally kept simple while the permanent pricing model is
                    still being defined.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {inclusions.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[1.4rem] border border-[#e7dfd5] bg-[rgba(247,241,231,0.7)] px-4 py-4"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#160f0c] text-white">
                        <Check className="size-3.5" />
                      </span>
                      <p className="text-[0.98rem] leading-6 tracking-[-0.02em] text-[#342d29]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-[#d7cec3] bg-[#1a1411] p-7 text-white shadow-[0_24px_70px_rgba(29,20,16,0.22)] sm:p-8">
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="space-y-4">
                  <p className="text-[0.82rem] font-medium tracking-[0.08em] text-white/60 uppercase">
                    Next step
                  </p>
                  <h2 className="text-[2rem] leading-[1.02] font-normal tracking-[-0.06em] text-white">
                    Claim the deal while this pricing is live.
                  </h2>
                  <p className="text-[0.98rem] leading-7 tracking-[-0.02em] text-white/72">
                    Use the contact page if you want to buy now or have questions before getting
                    access.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="h-12 w-full rounded-full bg-white px-6 text-[0.98rem] font-medium tracking-[-0.02em] text-[#1a1411] shadow-none hover:bg-white/92 hover:text-[#1a1411] [a]:hover:bg-white/92 [a]:hover:text-[#1a1411]"
                  >
                    <Link href="/contact">
                      Get the 79€ deal
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full rounded-full border-white/14 bg-white/6 px-6 text-[0.98rem] font-medium tracking-[-0.02em] text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/login">Open the product</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingBackground(): React.ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={heroLandscape}
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,231,0.18)_0%,rgba(247,241,231,0.3)_26%,rgba(247,241,231,0.78)_54%,rgba(239,239,237,0.97)_79%,rgba(239,239,237,1)_100%)]" />
    </div>
  );
}
