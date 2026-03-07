'use client';


import { cn } from '@/lib/utils';

interface PricingToggleProps {
  readonly isAnnual: boolean;
  readonly onToggle: (annual: boolean) => void;
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps): React.ReactElement {
  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={cn(
          'text-sm font-medium transition-colors',
          !isAnnual ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Toggle annual billing"
        onClick={() => onToggle(!isAnnual)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isAnnual ? 'bg-primary' : 'bg-input'
        )}
      >
        <span
          className={cn(
            'pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform',
            isAnnual ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      <span
        className={cn(
          'text-sm font-medium transition-colors',
          isAnnual ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        Annual
      </span>
      {isAnnual && (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Save 20%
        </span>
      )}
    </div>
  );
}
