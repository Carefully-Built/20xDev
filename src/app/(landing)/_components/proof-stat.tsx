'use client';

import CountUp from 'react-countup';

interface ProofStatProps {
  readonly start: number;
  readonly end: number;
  readonly suffix?: string;
  readonly label: string;
}

export function ProofStat({ start, end, suffix, label }: ProofStatProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[3.9rem] leading-none font-medium tracking-[-0.085em] text-black sm:text-[4.8rem]">
        <CountUp
          start={start}
          end={end}
          duration={1.4}
          suffix={suffix}
          enableScrollSpy
          scrollSpyOnce
        />
      </p>
      <p className="text-[1.05rem] leading-[1.35] tracking-[-0.02em] text-[color:var(--landing-ink)]">
        {label}
      </p>
    </div>
  );
}
