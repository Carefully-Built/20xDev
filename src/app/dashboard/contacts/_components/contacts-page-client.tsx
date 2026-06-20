'use client';

import { DashboardPageLayout } from '@carefully-built/app-shell';
import {
  CrudTableView,
  useCrudTableState,
  type CrudFilterDefinition,
} from '@carefully-built/crud';
import { buildContactImportCsvTemplate, buildCsvExport } from '@carefully-built/import-export';
import { Button, Chip, EmptyStateCard, type Column } from '@carefully-built/ui';
import { Download, FileDown, Plus, SearchX, UserRound, Workflow } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ContactFormSheet } from './contact-form-sheet';

import {
  useContactsByOrganization,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from '@/hooks/use-contacts';
import { useUsersByOrganization } from '@/hooks/use-users';
import { showDestructiveActionToast } from '@/lib/ui/destructive-action-toast';
import { useOrganization } from '@/providers';

import type { Doc } from '@convex/_generated/dataModel';
import type { api } from '@convex/_generated/api';
import type { FunctionArgs } from 'convex/server';

type Contact = Doc<'contacts'>;
type ContactData = FunctionArgs<typeof api.functions.contacts.mutations.create>['data'];

const statusLabels: Record<Contact['status'], string> = {
  customer: 'Customer',
  new: 'New',
  proposal: 'Proposal',
  qualified: 'Qualified',
};

const columns: Column<Contact>[] = [
  { accessor: 'name', header: 'Name' },
  { accessor: 'company', header: 'Company' },
  { accessor: 'role', header: 'Role' },
  {
    accessor: 'status',
    header: 'Status',
    render: (_value, contact) => <Chip>{statusLabels[contact.status]}</Chip>,
  },
  { accessor: 'owner', header: 'Owner' },
];

const statusFilter: CrudFilterDefinition<Contact> = {
  key: 'status',
  config: {
    key: 'status',
    label: 'Status',
    icon: Workflow,
    options: Object.entries(statusLabels).map(([value, label]) => ({ label, value })),
  },
};

function downloadCsv(filename: string, csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ContactsPageClient(): React.ReactElement {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const contacts = useContactsByOrganization(organizationId);
  const users = useUsersByOrganization(organizationId);
  const createContact = useCreateContact(organizationId);
  const updateContact = useUpdateContact(organizationId);
  const deleteContact = useDeleteContact(organizationId);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tableData = useMemo(() => contacts ?? [], [contacts]);
  const ownerFilter = useMemo<CrudFilterDefinition<Contact>>(
    () => ({
      key: 'owner',
      config: {
        key: 'owner',
        label: 'Owner',
        icon: UserRound,
        options: [
          ...new Set(
            tableData.flatMap((contact) => (contact.owner ? [contact.owner] : [])),
          ),
        ].map((owner) => ({ label: owner, value: owner })),
      },
    }),
    [tableData],
  );
  const filters = useMemo(() => [statusFilter, ownerFilter], [ownerFilter]);
  const tableState = useCrudTableState({
    data: tableData,
    columns,
    filters,
    searchFields: ['name', 'company', 'role', 'owner', 'email'],
    pageSize: 20,
  });

  const openCreateSheet = (): void => {
    setEditingContact(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (contact: Contact): void => {
    setEditingContact(contact);
    setIsSheetOpen(true);
  };

  const saveContact = async (data: ContactData): Promise<void> => {
    setIsSaving(true);
    try {
      if (editingContact) {
        await updateContact(editingContact._id, data);
      } else {
        await createContact(data);
      }
      setIsSheetOpen(false);
      toast.success(editingContact ? 'Contact updated' : 'Contact added');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save contact');
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (contact: Contact): void => {
    showDestructiveActionToast({
      message: `Delete "${contact.name}"?`,
      onConfirm: async () => {
        try {
          await deleteContact(contact._id);
          toast.success('Contact deleted');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Could not delete contact');
        }
      },
    });
  };

  const exportContacts = (): void => {
    downloadCsv(
      'contacts.csv',
      buildCsvExport(tableData, [
        { header: 'Name', value: (contact) => contact.name },
        { header: 'Company', value: (contact) => contact.company },
        { header: 'Email', value: (contact) => contact.email },
        { header: 'Phone', value: (contact) => contact.phone },
        { header: 'Owner', value: (contact) => contact.owner },
        { header: 'Status', value: (contact) => statusLabels[contact.status] },
        { header: 'Value', value: (contact) => contact.value },
      ]),
    );
  };

  return (
    <DashboardPageLayout
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => downloadCsv('contacts-import-template.csv', buildContactImportCsvTemplate())}
          >
            <FileDown className="size-4" />
            Template
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={exportContacts}>
            <Download className="size-4" />
            Export
          </Button>
          <Button type="button" size="sm" onClick={openCreateSheet}>
            <Plus className="size-4" />
            Add contact
          </Button>
        </div>
      }
      title="Contacts"
    >
      <CrudTableView
        state={tableState}
        filters={filters}
        searchPlaceholder="Search contacts..."
        actions={['edit', 'delete']}
        actionHandlers={{
          onDelete: requestDelete,
          onEdit: openEditSheet,
        }}
        columns={columns}
        getRowKey={(contact) => contact._id}
        onRowClick={(contact) => {
          router.push(`/dashboard/contacts/${contact._id}`);
        }}
        isLoading={Boolean(organizationId) && contacts === undefined}
        noDataMessage="No contacts yet"
        noResultsContent={
          <EmptyStateCard
            icon={<SearchX className="size-7" />}
            title="No contacts found"
            subtitle="Try changing your search or filters."
          />
        }
      />
      <ContactFormSheet
        contact={editingContact}
        loading={isSaving}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={saveContact}
        users={users ?? []}
      />
    </DashboardPageLayout>
  );
}
