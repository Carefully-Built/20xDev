interface ProofMetricCardProps {
  readonly value: string;
  readonly label: string;
  readonly detail: string;
}

export function ProofMetricCard({
  value,
  label,
  detail,
}: ProofMetricCardProps): React.ReactElement {
  return (
    <article className="rounded-[1.75rem] border border-black/6 bg-white/82 p-6 shadow-[0_18px_50px_rgba(30,25,20,0.06)]">
      <p className="text-[2.8rem] leading-none font-medium tracking-[-0.08em] text-[color:var(--landing-ink)] sm:text-[3.3rem]">
        {value}
      </p>
      <h3 className="mt-4 text-[1.02rem] font-medium tracking-[-0.03em] text-[color:var(--landing-ink)]">
        {label}
      </h3>
      <p className="mt-2 max-w-[24ch] text-sm leading-6 tracking-[-0.02em] text-black/56">
        {detail}
      </p>
    </article>
  );
}
