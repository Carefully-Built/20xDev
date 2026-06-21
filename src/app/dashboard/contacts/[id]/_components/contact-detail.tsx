'use client';

import {
  EntityAssociatedEmptyTab,
  EntityAssociatedTabPanel,
  EntityDetailShell,
  ENTITY_DETAIL_TABS,
  type EntityDetailTabOption,
} from '@carefully-built/resource-kit';
import { EmptyStateCard } from '@carefully-built/ui';
import { CalendarDays, FileText, LayoutDashboard, NotebookPen, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ContactFormSheet } from '../../_components/contact-form-sheet';
import { ContactDetailSidebar } from './contact-detail-sidebar';
import { ContactOverview } from './contact-overview';

import { useContact, useUpdateContact } from '@/hooks/use-contacts';
import { useUsersByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';

import type { Id } from '@convex/_generated/dataModel';
import type { api } from '@convex/_generated/api';
import type { FunctionArgs } from 'convex/server';

type ContactDetailTab = 'overview' | 'notes' | 'documents' | 'agenda';
type ContactData = FunctionArgs<typeof api.functions.contacts.mutations.update>['data'];

const detailTabValues = {
  overview: 'overview',
  notes: ENTITY_DETAIL_TABS[3] as 'notes',
  documents: ENTITY_DETAIL_TABS[4] as 'documents',
  agenda: ENTITY_DETAIL_TABS[6] as 'agenda',
} as const satisfies Record<ContactDetailTab, ContactDetailTab>;

const tabs: readonly EntityDetailTabOption<ContactDetailTab>[] = [
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

interface ContactDetailProps {
  readonly id: Id<'contacts'>;
}

export function ContactDetail({ id }: ContactDetailProps): React.ReactElement {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const contact = useContact(id, organizationId);
  const updateContact = useUpdateContact(organizationId);
  const users = useUsersByOrganization(organizationId);
  const [activeTab, setActiveTab] = useState<ContactDetailTab>('overview');
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function saveContact(data: ContactData): Promise<void> {
    setIsSaving(true);
    try {
      await updateContact(id, data);
      setIsEditSheetOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  if (contact === null) {
    return (
      <EmptyStateCard
        icon={<UserRound className="size-7" />}
        title="Contact not found"
        subtitle="This contact is not available anymore."
        actionLabel="Back to contacts"
        onAction={() => router.push('/dashboard/contacts')}
      />
    );
  }

  return (
    <>
      <EntityDetailShell
        activeTab={activeTab}
        mobileSidebarLabel="Contact details"
        onTabChange={setActiveTab}
        showSidebar
        sidebar={
          contact ? (
            <ContactDetailSidebar contact={contact} onEdit={() => setIsEditSheetOpen(true)} />
          ) : null
        }
        tabs={tabs}
        title={contact?.name ?? 'Contact'}
      >
        {activeTab === 'overview' && contact ? <ContactOverview contact={contact} /> : null}
        {activeTab === 'notes' ? (
          <EntityAssociatedTabPanel icon={NotebookPen} name="Notes">
            <EntityAssociatedEmptyTab
              icon={NotebookPen}
              title="No notes connected"
              subtitle="Notes associated with this contact will appear here."
            />
          </EntityAssociatedTabPanel>
        ) : null}
        {activeTab === 'documents' ? (
          <EntityAssociatedTabPanel icon={FileText} name="Documents">
            <EntityAssociatedEmptyTab
              icon={FileText}
              title="No documents connected"
              subtitle="Documents associated with this contact will appear here."
            />
          </EntityAssociatedTabPanel>
        ) : null}
        {activeTab === 'agenda' ? (
          <EntityAssociatedTabPanel icon={CalendarDays} name="Activity">
            <EntityAssociatedEmptyTab
              icon={CalendarDays}
              title="No activity connected"
              subtitle="Activity associated with this contact will appear here."
            />
          </EntityAssociatedTabPanel>
        ) : null}
      </EntityDetailShell>
      <ContactFormSheet
        contact={contact ?? null}
        loading={isSaving}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={saveContact}
        users={users ?? []}
      />
    </>
  );
}
