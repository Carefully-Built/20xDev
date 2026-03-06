'use client';

import { Rocket, Bot, Building2, Layers } from 'lucide-react';

import { Fade } from '@/components/animate-ui/fade';
import { Slide } from '@/components/animate-ui/slide';
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
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Fade inView inViewOnce inViewMargin="-50px">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to ship
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop rebuilding the same infrastructure. Start with a foundation that scales.
            </p>
          </div>
        </Fade>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Slide key={feature.title} direction="up" delay={i * 150} inView inViewOnce inViewMargin="-50px">
              <Card className="border-0 bg-muted/50 transition-colors hover:bg-muted">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Slide>
          ))}
        </div>
      </div>
    </section>
  );
}
