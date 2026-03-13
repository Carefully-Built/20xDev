import Image from 'next/image';

import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

const heroLandscape = '/images/website/background.avif';

export const metadata: Metadata = {
  title: `About - ${siteConfig.name}`,
  description:
    'Why this B2B SaaS starter exists: give founders and agents a production-ready base so they can skip setup and start building product.',
};

export default function AboutPage(): React.ReactElement {
  return (
    <section className="relative overflow-hidden border-b border-black/6">
      <AboutBackground />

      <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-20 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-24 lg:pt-[33rem]">
        <div className="mx-auto flex max-w-[700px] flex-col gap-12">
          <header>
            <h1 className="max-w-[11ch] text-[clamp(3.3rem,7vw,4.5rem)] leading-[0.97] font-normal tracking-[-0.065em] text-[#222221]">
              The starting point for agent-built SaaS
            </h1>
          </header>

          <div className="flex flex-col gap-14">
            <div className="max-w-[680px] text-[clamp(1.45rem,2.5vw,2rem)] leading-[1.48] tracking-[-0.04em] text-[#292421]">
              <p>
                {siteConfig.name} exists for founders and product teams who want agents to build
                their SaaS without losing weeks on the initial setup. Instead of starting from an
                empty repo, you begin with the hard, repetitive foundation already in place:
                authentication, organizations, billing, data, files, dashboard patterns, and the
                deployment glue around them.
              </p>
            </div>

            <div className="max-w-[680px] space-y-5 pt-1 text-[clamp(1.05rem,1.6vw,1.18rem)] leading-[1.48] tracking-[-0.03em] text-[#4d4846]">
              <p>
                The toolkit is opinionated on purpose. It is built to give you a clear steering
                wheel while giving agents enough structure to move fast and make useful decisions.
                You stay focused on the product direction, workflows, and customer value instead of
                re-explaining the same boilerplate architecture over and over.
              </p>
              <p>
                Every core technology in the default stack was chosen with a free tier or generous
                starter plan in mind, so you can ship, test, and onboard early users without
                worrying about paying for infrastructure before the product has real traction.
              </p>
              <p>
                It is a launchpad for B2B SaaS, internal tools, and AI products that need a serious
                base from day one. Skip the initial work. Start guiding the system that builds your
                company.
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
