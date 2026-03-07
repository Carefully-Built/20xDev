import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Zap, Heart, Code, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Blueprint — the production-ready Next.js foundation for building B2B SaaS applications.',
  openGraph: {
    title: 'About Blueprint',
    description:
      'Learn about Blueprint — the production-ready Next.js foundation for building B2B SaaS applications.',
  },
};

interface Value {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly id: string;
}

const values: readonly Value[] = [
  {
    icon: Zap,
    title: 'Ship Fast',
    description:
      'Go from idea to production in hours, not months. Pre-built infrastructure lets you focus on what makes your product unique.',
    id: 'shipFast',
  },
  {
    icon: Code,
    title: 'Developer First',
    description:
      'Built by developers, for developers. Clean code, strong typing, and modern tooling that gets out of your way.',
    id: 'developerFirst',
  },
  {
    icon: Target,
    title: 'Quality Matters',
    description:
      'Every component is tested, accessible, and production-ready. No shortcuts, no tech debt from day one.',
    id: 'qualityMatters',
  },
  {
    icon: Heart,
    title: 'Open & Transparent',
    description:
      'Built in the open with clear documentation. You own your code and can customize everything.',
    id: 'openTransparent',
  },
];

export default function AboutPage(): React.ReactElement {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About Blueprint
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            
              The production-ready foundation for building B2B SaaS
              applications. We help developers ship faster without sacrificing
              quality.
            
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">
                Our Mission
              </h2>
              <p className="mt-4 text-muted-foreground">
                
                  To eliminate the repetitive infrastructure work that slows
                  down every new SaaS project. We believe developers should
                  spend their time building features that matter, not
                  reinventing authentication, payments, and data layers from
                  scratch.
                
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                Our Vision
              </h2>
              <p className="mt-4 text-muted-foreground">
                
                  A world where launching a production-grade SaaS takes hours
                  instead of months. Where every developer has access to the
                  same quality infrastructure that powers the best products on
                  the web.
                
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold">
            Our Values
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.id}
                className="rounded-xl border bg-background p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <value.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  <T id={`about.values.${value.id}.title`}>{value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <T id={`about.values.${value.id}.description`}>
                    {value.description}
                  
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold">
            The Story
          </h2>
          <p className="mt-4 text-muted-foreground">
            
              Blueprint was born from a simple frustration: every time we
              started a new SaaS project, we spent weeks building the same
              foundational pieces. Authentication, billing, database setup,
              email systems — the list goes on.
            
          </p>
          <p className="mt-4 text-muted-foreground">
            
              We decided to build the foundation once, and build it right.
              Blueprint is the result — a production-ready starter that
              includes everything you need to launch a B2B SaaS, built with
              the latest and best tools in the ecosystem.
            
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold">
            Ready to get started?
          </h2>
          <p className="mt-4 text-muted-foreground">
            
              Join developers who are shipping faster with Blueprint. Get up
              and running in minutes.
            
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="min-w-40" asChild>
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-40" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
