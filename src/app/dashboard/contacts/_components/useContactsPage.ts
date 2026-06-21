import { useCrudTableState, type CrudFilterDefinition } from '@carefully-built/saas-kit/crud';
import { buildContactImportMutationPayload, useContactImportState } from '@carefully-built/saas-kit/import-export';
import { showDestructiveActionToast } from '@carefully-built/saas-kit/resource-kit';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { Id } from '@convex/_generated/dataModel';

import {
  useContactsByOrganization,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from '@/hooks/use-contacts';
import { useUsersByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';

import { buildContactsCsv, downloadCsv, toContactData } from './contacts-import-export';
import { buildContactOwnerFilter, contactColumns, contactStatusFilter } from './contacts-table';
import type { Contact, ContactData } from './contacts.types';

export function useContactsPage() {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const contacts = useContactsByOrganization(organizationId);
  const users = useUsersByOrganization(organizationId);
  const createContact = useCreateContact(organizationId);
  const updateContact = useUpdateContact(organizationId);
  const deleteContact = useDeleteContact(organizationId);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tableData = useMemo(() => contacts ?? [], [contacts]);
  const ownerFilter = useMemo(() => buildContactOwnerFilter(tableData), [tableData]);
  const filters = useMemo<CrudFilterDefinition<Contact>[]>(
    () => [contactStatusFilter, ownerFilter],
    [ownerFilter],
  );
  const tableState = useCrudTableState({
    data: tableData,
    columns: contactColumns,
    filters,
    searchFields: ['name', 'company', 'role', 'owner', 'email'],
    pageSize: 20,
  });
  const importState = useContactImportState({
    existingContacts: tableData.map((contact) => ({
      _id: String(contact._id),
      email: contact.email,
      phone: contact.phone,
    })),
    onErrorMessage: (error) => (error instanceof Error ? error.message : 'Could not parse file'),
  });

  function openCreateSheet(): void {
    setEditingContact(null);
    setIsSheetOpen(true);
  }

  function openEditSheet(contact: Contact): void {
    setEditingContact(contact);
    setIsSheetOpen(true);
  }

  async function saveContact(data: ContactData): Promise<void> {
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
  }

  function requestDelete(contact: Contact): void {
    showDestructiveActionToast({
      confirmLabel: 'Delete',
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
  }

  function exportContacts(): void {
    downloadCsv('contacts.csv', buildContactsCsv(tableData));
  }

  async function confirmImport(): Promise<void> {
    const payload = buildContactImportMutationPayload(importState.importPreviewRows);

    setIsImporting(true);
    try {
      for (const row of payload.creates) {
        await createContact(toContactData(row));
      }

      for (const row of payload.updates) {
        await updateContact(row.id as Id<'contacts'>, toContactData(row.data));
      }

      toast.success('Contacts imported');
      importState.closeImportSheet();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not import contacts');
    } finally {
      setIsImporting(false);
    }
  }

  return {
    columns: contactColumns,
    confirmImport,
    editingContact,
    exportContacts,
    filters,
    importState,
    isImporting,
    isLoading: Boolean(organizationId) && contacts === undefined,
    isSaving,
    isSheetOpen,
    openCreateSheet,
    openEditSheet,
    requestDelete,
    router,
    saveContact,
    setIsSheetOpen,
    tableState,
    users: users ?? [],
  };
}
