import { CtaSection } from './_components/cta-section';
import { FaqSection } from './_components/faq-section';
import { FeaturesSection } from './_components/features-section';
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

      {/* Features Section */}
      <FeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <CtaSection />
    </>
  );
}
