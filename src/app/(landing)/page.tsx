import { CtaSection } from './_components/cta-section';
import { FaqSection } from './_components/faq-section';
import { FeaturesSection } from './_components/features-section';
import { HeroSection } from './_components/hero-section';
import { ProofSection } from './_components/proof-section';
import { TechStackSection } from './_components/tech-stack-section';

import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} - Ship B2B SaaS in Hours`,
  description: siteConfig.description,
};

export default function LandingPage(): React.ReactElement {
  return (
    <>
      <HeroSection />
      <ProofSection />
      <FeaturesSection />
      <TechStackSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
