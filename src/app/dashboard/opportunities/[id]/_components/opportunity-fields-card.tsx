'use client';

import {
  Button,
  Chip,
  FieldDetailRow,
} from '@carefully-built/ui';
import { Building2, CircleDollarSign, NotebookText, Pencil, UserRound } from 'lucide-react';

import type { EditableOpportunity } from './opportunity-types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

interface OpportunityFieldsCardProps {
  readonly onEdit: () => void;
  readonly opportunity: EditableOpportunity;
  readonly stageName: string;
}

export function OpportunityFieldsCard({
  onEdit,
  opportunity,
  stageName,
}: OpportunityFieldsCardProps): React.ReactElement {
  return (
    <section className="bg-background h-full">
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="text-muted-foreground size-4" />
          Opportunity fields
        </div>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit opportunity">
          <Pencil className="size-4" />
        </Button>
      </div>
      <div className="space-y-0">
        <FieldDetailRow
          icon={CircleDollarSign}
          label="Value"
          value={currencyFormatter.format(opportunity.value ?? 0)}
        />
        <FieldDetailRow icon={Building2} label="Stage" value={stageName} />
        <FieldDetailRow
          icon={UserRound}
          label="Owner"
          value={opportunity.assignedUserName ?? 'Unassigned'}
        />
        <FieldDetailRow
          icon={NotebookText}
          label="Status"
          value={<Chip>{opportunity.status ?? 'open'}</Chip>}
        />
      </div>
    </section>
  );
}
