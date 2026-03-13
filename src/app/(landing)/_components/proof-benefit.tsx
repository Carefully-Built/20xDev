import type { LucideIcon } from 'lucide-react';

interface ProofBenefitProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly bordered?: boolean;
}

export function ProofBenefit({
  icon,
  title,
  description,
  bordered = false,
}: ProofBenefitProps): React.ReactElement {
  const Icon = icon;

  return (
    <article
      className={[
        'flex flex-col gap-6 py-10',
        bordered ? 'border-t border-black/10 md:border-l md:px-5' : 'border-t border-black/10 md:pr-5',
      ].join(' ')}
    >
      <div className="flex size-9 items-center justify-center">
        <Icon className="size-7 stroke-[1.5] text-[color:var(--landing-accent-strong)]" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-[1.14rem] leading-7 tracking-[-0.03em] text-[color:var(--landing-ink)]">
          {title}
        </h3>
        <p className="max-w-[22ch] text-[0.98rem] leading-8 tracking-[-0.02em] text-black/56">
          {description}
        </p>
      </div>
    </article>
  );
}
