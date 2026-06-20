'use client';

import { DashboardWidget } from '@carefully-built/widgets';
import { CircleDollarSign, UserRound } from 'lucide-react';

import type { Doc } from '@convex/_generated/dataModel';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

interface ContactOverviewProps {
  readonly contact: Doc<'contacts'>;
}

export function ContactOverview({ contact }: ContactOverviewProps): React.ReactElement {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <DashboardWidget
        icon={CircleDollarSign}
        title="Pipeline value"
        value={currencyFormatter.format(contact.value ?? 0)}
      />
      <DashboardWidget icon={UserRound} title="Owner" value={contact.owner ?? 'Unassigned'} />
    </div>
  );
}
