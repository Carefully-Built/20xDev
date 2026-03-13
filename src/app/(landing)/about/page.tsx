import Image from 'next/image';

import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

const heroLandscape = '/images/website/background.avif';

export const metadata: Metadata = {
  title: `About - ${siteConfig.name}`,
  description:
    'Why 20xdev exists: give AI-native teams a production-ready base so they can operate like companies far larger than their headcount.',
};

export default function AboutPage(): React.ReactElement {
  return (
    <section className="relative overflow-hidden border-b border-black/6">
      <AboutBackground />

      <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-20 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-24 lg:pt-[33rem]">
        <div className="mx-auto flex max-w-[700px] flex-col gap-12">
          <header>
            <h1 className="max-w-[11ch] text-[clamp(3.3rem,7vw,4.5rem)] leading-[0.97] font-normal tracking-[-0.065em] text-[#222221]">
              Built for the next generation of 20x companies
            </h1>
          </header>

          <div className="flex flex-col gap-14">
            <div className="max-w-[680px] text-[clamp(1.45rem,2.5vw,2rem)] leading-[1.48] tracking-[-0.04em] text-[#292421]">
              <p>
                The name {siteConfig.name} comes from the idea of 20x companies: small AI-native
                teams that can compete with companies many times larger because they build with
                leverage, not headcount. This starter exists for founders and product teams who
                want that kind of operating model from day one.
              </p>
            </div>

            <div className="max-w-[680px] space-y-5 pt-1 text-[clamp(1.05rem,1.6vw,1.18rem)] leading-[1.48] tracking-[-0.03em] text-[#4d4846]">
              <p>
                Instead of starting from an empty repo, you begin with the hard, repetitive
                foundation already in place: authentication, organizations, billing, data, files,
                dashboard patterns, and the deployment glue around them. The goal is simple: spend
                less time rebuilding infrastructure and more time shipping the product edge that
                makes your company hard to beat.
              </p>
              <p>
                The toolkit is opinionated on purpose. It gives agents enough structure to move
                fast and make useful decisions while giving founders a clear steering wheel. You
                stay focused on the roadmap, workflows, and customer value instead of re-explaining
                the same boilerplate architecture over and over.
              </p>
              <p>
                Every core technology in the default stack was chosen to help small teams ship,
                test, and grow without unnecessary overhead. It is a launchpad for B2B SaaS,
                internal tools, and AI products that want to operate with the output of a much
                larger team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutBackground(): React.ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={heroLandscape}
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,231,0.62)_0%,rgba(247,241,231,0.74)_34%,rgba(247,241,231,0.9)_58%,rgba(239,239,237,0.98)_76%,rgba(239,239,237,1)_100%)]" />
    </div>
  );
}
