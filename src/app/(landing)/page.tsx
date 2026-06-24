import Link from 'next/link';

import { FaqSection } from './_components/faq-section';
import { FeaturesSection } from './_components/features-section';
import { HeroSection } from './_components/hero-section';
import { InteractiveShowcaseSection } from './_components/interactive-showcase-section';
import { ProofSection } from './_components/proof-section';
import { TechStackSection } from './_components/tech-stack-section';

import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} - Ship B2B SaaS in Hours`,
  description: siteConfig.description,
};

export default function LandingPage(): React.ReactElement {
  // A fork that brings its own landing sets NEXT_PUBLIC_FEATURE_MARKETING_SITE=0:
  // 20xdev's marketing sections are dropped and replaced by a minimal branded
  // hero so `/` is never blank. Default (flag on) renders the full site unchanged.
  if (!siteConfig.features.marketingSite) {
    return <MinimalHero />;
  }

  return (
    <>
      <HeroSection />
      <ProofSection />
      <InteractiveShowcaseSection />
      <FeaturesSection />
      <TechStackSection />
      <FaqSection />
    </>
  );
}

function MinimalHero(): React.ReactElement {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg">{siteConfig.description}</p>
      <Button asChild size="lg">
        <Link href="/pricing">Get started</Link>
      </Button>
    </section>
  );
}
