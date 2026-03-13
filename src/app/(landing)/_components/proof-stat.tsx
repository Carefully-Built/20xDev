interface ProofStatProps {
  readonly value: string;
  readonly label: string;
}

export function ProofStat({ value, label }: ProofStatProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[3.9rem] leading-none font-medium tracking-[-0.085em] text-black sm:text-[4.8rem]">
        {value}
      </p>
      <p className="text-[1.05rem] leading-[1.35] tracking-[-0.02em] text-[color:var(--landing-ink)]">
        {label}
      </p>
    </div>
  );
}
