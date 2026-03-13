import { BadgeDollarSign, ChartNoAxesCombined, ShieldCheck } from 'lucide-react';

import { ProofBenefit } from './proof-benefit';
import { ProofStat } from './proof-stat';

const stats = [
  { start: 0, end: 120, suffix: 'h', label: 'Saved on launch setup' },
  { start: 0, end: 24, suffix: '', label: 'Tools with generous free tiers' },
  { start: 3, end: 1, suffix: '', label: 'Foundation to ship and scale from' },
] as const;

const benefits = [
  {
    icon: ChartNoAxesCombined,
    title: 'Drive revenue',
    description: 'Launch faster with prewired auth, billing, CMS, and product pages that move visitors into the app.',
  },
  {
    icon: ShieldCheck,
    title: 'Future-proof the stack',
    description: 'Standardise your setup early so new features land on a clean base instead of a patchwork of starters.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Reduce setup cost',
    description: 'Spend less on glue code, rework, and tooling churn by starting from one coherent production-ready system.',
  },
] as const;

export function ProofSection(): React.ReactElement {
  return (
    <section className="bg-[color:var(--landing-surface)] px-4 pb-28 pt-[7.95rem] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-[28rem]">
          <h2 className="text-[2.75rem] leading-[0.98] tracking-[-0.065em] text-[color:var(--landing-accent-strong)] sm:text-[3.55rem] sm:leading-[1.03]">
            <span className="block">Designed to convert.</span>
            <span className="block">Built to scale.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-16">
          {stats.map((stat) => (
            <ProofStat
              key={stat.label}
              start={stat.start}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-0 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <ProofBenefit
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              bordered={index > 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
