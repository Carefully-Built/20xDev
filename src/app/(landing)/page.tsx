import { FeatureGrid } from '@/components/marketing/feature-grid';
import { FeatureList } from '@/components/marketing/feature-list';
import { FeatureWithImage } from '@/components/marketing/feature-with-image';

import { CtaSection } from './_components/cta-section';
import { FaqSection } from './_components/faq-section';
import { HeroSection } from './_components/hero-section';
import { TechStackSection } from './_components/tech-stack-section';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blueprint - Ship B2B SaaS in Hours',
  description: 'Production-ready Next.js template with auth, payments, real-time data, and stunning UI. Stop rebuilding. Start shipping.',
};

export default function LandingPage(): React.ReactElement {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Feature Showcase with Images */}
      <FeatureWithImage />

      {/* Feature List */}
      <FeatureList />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <CtaSection />
    </>
  );
}
