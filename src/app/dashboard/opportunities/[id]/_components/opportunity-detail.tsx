'use client';

import { EntityAssociatedEmptyTab, EntityAssociatedTabPanel, EntityDetailShell, ENTITY_DETAIL_TABS, type EntityDetailTabOption } from '@carefully-built/saas-kit/resource-kit';
import { Card, CardContent } from '@carefully-built/saas-kit';
import { RichTextRenderer, hasRichTextContent } from '@carefully-built/saas-kit/rich-text';
import { CalendarDays, FileText, LayoutDashboard, NotebookPen } from 'lucide-react';
import { useState } from 'react';

import { useUsersByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';

import { OpportunityEditSheet } from './opportunity-edit-sheet';
import { OpportunityFieldsCard } from './opportunity-fields-card';
import { OpportunityOverviewCard } from './opportunity-overview-card';
import type { OpportunityDetailTab } from './opportunity-types';
import { useOpportunityDetail } from './use-opportunity-detail';

const detailTabValues = {
  overview: 'overview',
  notes: ENTITY_DETAIL_TABS[3] as 'notes',
  documents: ENTITY_DETAIL_TABS[4] as 'documents',
  agenda: ENTITY_DETAIL_TABS[6] as 'agenda',
} as const satisfies Record<OpportunityDetailTab, OpportunityDetailTab>;

const tabs: readonly EntityDetailTabOption<OpportunityDetailTab>[] = [
  { icon: <LayoutDashboard className="size-3.5" />, label: 'Overview', value: 'overview' },
  {
    count: 0,
    icon: <NotebookPen className="size-3.5" />,
    label: 'Notes',
    value: detailTabValues.notes,
  },
  {
    count: 0,
    icon: <FileText className="size-3.5" />,
    label: 'Documents',
    value: detailTabValues.documents,
  },
  {
    count: 0,
    icon: <CalendarDays className="size-3.5" />,
    label: 'Activity',
    value: detailTabValues.agenda,
  },
];

interface OpportunityDetailProps {
  readonly id: string;
}

export function OpportunityDetail({ id }: OpportunityDetailProps): React.ReactElement {
  const { organizationId } = useOrganization();
  const users = useUsersByOrganization(organizationId);
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
          <CardContent className="text-muted-foreground p-4 text-sm">
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
        {activeTab === 'overview' ? <OpportunityOverviewCard /> : null}
        {activeTab === 'notes' ? <OpportunityNotes notes={opportunity.notes} /> : null}
        {activeTab === 'documents' ? (
          <EntityAssociatedTabPanel icon={FileText} name="Documents">
            <EntityAssociatedEmptyTab
              icon={FileText}
              title="No documents connected"
              subtitle="Documents associated with this opportunity will appear here."
            />
          </EntityAssociatedTabPanel>
        ) : null}
        {activeTab === 'agenda' ? (
          <EntityAssociatedTabPanel icon={CalendarDays} name="Activity">
            <EntityAssociatedEmptyTab
              icon={CalendarDays}
              title="No activity connected"
              subtitle="Activity associated with this opportunity will appear here."
            />
          </EntityAssociatedTabPanel>
        ) : null}
      </EntityDetailShell>
      <OpportunityEditSheet
        initialValues={formValues}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSave={saveOpportunity}
        users={users ?? []}
      />
    </>
  );
}

function OpportunityNotes({ notes }: { readonly notes?: string | null }): React.ReactElement {
  if (!hasRichTextContent(notes)) {
    return (
      <EntityAssociatedTabPanel icon={NotebookPen} name="Notes">
        <EntityAssociatedEmptyTab
          icon={NotebookPen}
          title="No notes connected"
          subtitle="Notes associated with this opportunity will appear here."
        />
      </EntityAssociatedTabPanel>
    );
  }

  return (
    <EntityAssociatedTabPanel icon={NotebookPen} name="Notes">
      <Card>
        <CardContent className="p-4">
          <RichTextRenderer value={notes} />
        </CardContent>
      </Card>
    </EntityAssociatedTabPanel>
  );
}
