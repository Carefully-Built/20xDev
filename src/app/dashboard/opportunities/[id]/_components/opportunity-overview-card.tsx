'use client';

import { Button, Card, CardContent, Chip } from '@carefully-built/ui';
import { NotebookText, Pencil } from 'lucide-react';

import type { EditableOpportunity } from './opportunity-types';

interface OpportunityOverviewCardProps {
  readonly onEdit: () => void;
  readonly opportunity: EditableOpportunity;
}

export function OpportunityOverviewCard({
  onEdit,
  opportunity,
}: OpportunityOverviewCardProps): React.ReactElement {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <NotebookText className="text-muted-foreground size-4" />
          Overview
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onEdit}
          aria-label="Edit opportunity overview"
        >
          <Pencil className="size-4" />
        </Button>
      </div>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{opportunity.notes}</p>
        <div className="flex flex-wrap gap-2">
          {opportunity.associations.map((association) => (
            <Chip key={association.value}>{association.label}</Chip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
