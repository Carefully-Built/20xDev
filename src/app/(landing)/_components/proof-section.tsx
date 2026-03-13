import { LandingSectionHeading } from './landing-section-heading';
import { ProofMetricCard } from './proof-metric-card';

const proofMetrics = [
  {
    value: '120h',
    label: 'Saved on the first launch cycle',
    detail: 'Prewired auth, billing, dashboard, and real-time data remove weeks of setup before you ship anything useful.',
  },
  {
    value: '24',
    label: 'Best-in-class tools with generous free tiers',
    detail: 'Start lean with infrastructure that stays affordable while you validate, launch, and grow your first users.',
  },
  {
    value: '1',
    label: 'Production-ready foundation instead of scattered starters',
    detail: 'Use one opinionated codebase for marketing pages, app shell, payments, CMS, and enterprise-ready auth.',
  },
] as const;

export function ProofSection(): React.ReactElement {
  return (
    <section className="border-b border-black/6 bg-[color:var(--landing-panel)] py-18 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeading
          eyebrow="Proof, not promises"
          title="Built to compress time-to-launch without adding hidden setup debt"
          description="The fastest way to trust a starter is to see what it replaces. These are the bottlenecks 20xdev removes before your team writes feature one."
          className="mx-auto max-w-4xl"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {proofMetrics.map((metric) => (
            <ProofMetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
              detail={metric.detail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
