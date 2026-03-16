'use client';

import { useEffect, useRef, useState } from 'react';

interface ProofStatProps {
  readonly start: number;
  readonly end: number;
  readonly suffix?: string;
  readonly label: string;
}

export function ProofStat({ start, end, suffix, label }: ProofStatProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [value, setValue] = useState(start);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    const duration = 1400;
    let hasAnimated = false;

    const animate = (): void => {
      if (hasAnimated) {
        return;
      }

      hasAnimated = true;
      const startedAt = window.performance.now();

      const step = (timestamp: number): void => {
        const progress = Math.min((timestamp - startedAt) / duration, 1);
        const nextValue = Math.round(start + (end - start) * progress);

        setValue(nextValue);

        if (progress < 1) {
          frameRef.current = window.requestAnimationFrame(step);
        }
      };

      frameRef.current = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        animate();
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, start]);

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <p className="text-[3.9rem] leading-none font-medium tracking-[-0.085em] text-black sm:text-[4.8rem]">
        {value}
        {suffix}
      </p>
      <p className="text-[1.05rem] leading-[1.35] tracking-[-0.02em] text-[color:var(--landing-ink)]">
        {label}
      </p>
    </div>
  );
}
