'use client';

import {
  EntityAssociatedEmptyTab,
  EntityDetailShell,
  type EntityDetailTabOption,
} from '@carefully-built/resource-kit';
import { Card, CardContent } from '@carefully-built/ui';
import { CalendarDays, FileText, LayoutDashboard, NotebookPen } from 'lucide-react';
import { useState } from 'react';

import { OpportunityEditSheet } from './opportunity-edit-sheet';
import { OpportunityFieldsCard } from './opportunity-fields-card';
import { OpportunityOverviewCard } from './opportunity-overview-card';
import type { OpportunityDetailTab } from './opportunity-types';
import { useOpportunityDetail } from './use-opportunity-detail';

const tabs: readonly EntityDetailTabOption<OpportunityDetailTab>[] = [
  { icon: <LayoutDashboard className="size-3.5" />, label: 'Overview', value: 'overview' },
  { count: 0, icon: <NotebookPen className="size-3.5" />, label: 'Notes', value: 'notes' },
  { count: 0, icon: <FileText className="size-3.5" />, label: 'Documents', value: 'documents' },
  { count: 0, icon: <CalendarDays className="size-3.5" />, label: 'Activity', value: 'activity' },
];

interface OpportunityDetailProps {
  readonly id: string;
}

export function OpportunityDetail({ id }: OpportunityDetailProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<OpportunityDetailTab>('overview');
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const { formValues, opportunity, saveOpportunity, stage } = useOpportunityDetail(id);

  if (!opportunity) {
    return (
      <EntityDetailShell
        activeTab="overview"
        onTabChange={() => undefined}
        tabs={[{ label: 'Overview', value: 'overview' }]}
        title="Opportunity not found"
      >
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            This opportunity does not exist.
          </CardContent>
        </Card>
      </EntityDetailShell>
    );
  }

  return (
    <>
      <EntityDetailShell
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        title={opportunity.title}
        showSidebar
        mobileSidebarLabel="Opportunity fields"
        sidebar={
          <OpportunityFieldsCard
            opportunity={opportunity}
            stageName={stage?.name ?? 'Unknown'}
            onEdit={() => setIsEditSheetOpen(true)}
          />
        }
      >
        {activeTab === 'overview' ? (
          <OpportunityOverviewCard
            opportunity={opportunity}
            onEdit={() => setIsEditSheetOpen(true)}
          />
        ) : null}
        {activeTab === 'notes' ? (
          <EntityAssociatedEmptyTab
            icon={NotebookPen}
            title="No notes connected"
            subtitle="Notes associated with this opportunity will appear here."
          />
        ) : null}
        {activeTab === 'documents' ? (
          <EntityAssociatedEmptyTab
            icon={FileText}
            title="No documents connected"
            subtitle="Documents associated with this opportunity will appear here."
          />
        ) : null}
        {activeTab === 'activity' ? (
          <EntityAssociatedEmptyTab
            icon={CalendarDays}
            title="No activity connected"
            subtitle="Activity associated with this opportunity will appear here."
          />
        ) : null}
      </EntityDetailShell>
      <OpportunityEditSheet
        initialValues={formValues}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSave={saveOpportunity}
      />
    </>
  );
}
