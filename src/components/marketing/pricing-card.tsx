import { Check, X } from 'lucide-react';
import Link from 'next/link';

import type { PricingTier } from '@/config/pricing';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  readonly tier: PricingTier;
  readonly isAnnual: boolean;
}

export function PricingCard({ tier, isAnnual }: PricingCardProps): React.ReactElement {
  const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        tier.recommended && 'ring-2 ring-primary'
      )}
    >
      {tier.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1">
            Recommended
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold">{tier.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">${price}</span>
          <span className="text-sm text-muted-foreground">
            /mo
          </span>
        </div>
        {isAnnual && (
          <p className="mt-1 text-xs text-muted-foreground">
            Billed annually (${price * 12}/yr)
          </p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            ) : (
              <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
            )}
            <span
              className={cn(
                'text-sm',
                feature.included ? 'text-foreground' : 'text-muted-foreground/60'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        variant={tier.recommended ? 'default' : 'outline'}
        className="w-full"
        asChild
      >
        <Link href={tier.ctaHref}>{tier.cta}</Link>
      </Button>
    </div>
  );
}
