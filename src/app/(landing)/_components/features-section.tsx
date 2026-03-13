import { Rocket, Bot, Building2, Layers } from 'lucide-react';

import { LandingSectionHeading } from './landing-section-heading';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Rocket,
    title: 'Production-Ready',
    description: 'Ship faster with pre-built auth, dashboard, and payments. Everything you need to go live, out of the box.',
  },
  {
    icon: Bot,
    title: 'AI-Optimized',
    description: 'Clean architecture with clear patterns, perfect for AI code generation. Let AI help you build faster.',
  },
  {
    icon: Building2,
    title: 'B2B SaaS Ready',
    description: 'Multi-tenant by design with org management and role-based access. Enterprise features built-in.',
  },
  {
    icon: Layers,
    title: 'Modern Stack',
    description: 'Next.js 15, Convex, WorkOS, and shadcn/ui. The latest tools for building exceptional products.',
  },
];

export function FeaturesSection(): React.ReactElement {
  return (
    <section id="features" className="bg-[color:var(--landing-surface)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeading
          eyebrow="What ships with 20xdev"
          title="Everything you need to ship"
          description="Stop rebuilding the same infrastructure. Start with a foundation that scales."
          className="mx-auto max-w-3xl"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-[1.75rem] border-black/6 bg-white/78 shadow-[0_18px_50px_rgba(30,25,20,0.06)] transition-transform duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <feature.icon className="mb-3 size-5 text-[color:var(--landing-accent-strong)]" />
                <CardTitle className="text-lg tracking-[-0.03em] text-[color:var(--landing-ink)]">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-black/58">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
