import { useUrlStringFilters, type CrudFilterDefinition, type CrudTableState } from '@carefully-built/saas-kit/crud';
import { buildContactImportMutationPayload, useContactImportState } from '@carefully-built/saas-kit/import-export';
import { showDestructiveActionToast } from '@carefully-built/saas-kit/resource-kit';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
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

const CONTACT_URL_FILTERS = [
  { key: 'search', param: 'q', defaultValue: '', clearValue: '' },
  { key: 'status' },
  { key: 'owner' },
] as const;

function matchesSearch(contact: Contact, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) {
    return true;
  }

  return [contact.name, contact.company, contact.role, contact.owner, contact.email]
    .filter((value): value is string => typeof value === 'string')
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

function matchesFilters(contact: Contact, filters: Record<string, string>): boolean {
  return Object.entries(filters).every(([key, value]) => {
    if (!value || value === 'all') {
      return true;
    }

    return String(contact[key as keyof Contact] ?? '') === value;
  });
}

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
  const [sortState, setSortState] = useState<CrudTableState<Contact>['sortState']>(null);
  const urlFilters = useUrlStringFilters(CONTACT_URL_FILTERS);
  const search = urlFilters.values.search;

  const tableData = useMemo(() => contacts ?? [], [contacts]);
  const ownerFilter = useMemo(() => buildContactOwnerFilter(tableData), [tableData]);
  const filters = useMemo<CrudFilterDefinition<Contact>[]>(
    () => [contactStatusFilter, ownerFilter],
    [ownerFilter],
  );
  const activeFilters = useMemo(
    () => ({
      status: urlFilters.values.status,
      owner: urlFilters.values.owner,
    }),
    [urlFilters.values.owner, urlFilters.values.status],
  );
  const filteredData = useMemo(
    () =>
      tableData.filter(
        (contact) => matchesSearch(contact, search) && matchesFilters(contact, activeFilters),
      ),
    [activeFilters, search, tableData],
  );
  const setFilter = useCallback((key: string, value: string): void => {
    if (key === 'status' || key === 'owner') {
      urlFilters.setValue(key, value);
    }
  }, [urlFilters]);
  const clearAll = useCallback((): void => {
    urlFilters.clear();
  }, [urlFilters]);
  const getDraftFilterResultCount = useCallback(
    (draftValues: Record<string, string>) =>
      tableData.filter(
        (contact) =>
          matchesSearch(contact, search) &&
          matchesFilters(contact, { ...activeFilters, ...draftValues }),
      ).length,
    [activeFilters, search, tableData],
  );
  const tableState = useMemo<CrudTableState<Contact>>(
    () => ({
      clearAll,
      emptyState:
        search.trim().length > 0 || Object.values(activeFilters).some((value) => value !== 'all')
          ? 'no-results'
          : 'initial',
      filteredData,
      filters: activeFilters,
      getDraftFilterResultCount,
      hasFilters: Object.values(activeFilters).some((value) => value !== 'all'),
      hasSearch: search.trim().length > 0,
      paginatedData: filteredData,
      pagination: {
        currentPage: 1,
        endIndex: filteredData.length,
        onPageChange: () => {},
        pageSize: 20,
        startIndex: 0,
        totalItems: filteredData.length,
        totalPages: 1,
      },
      search,
      setFilter,
      setSearch: (value) => {
        urlFilters.setValue('search', value);
      },
      setSortState,
      sortedData: filteredData,
      sortState,
    }),
    [
      activeFilters,
      clearAll,
      filteredData,
      getDraftFilterResultCount,
      search,
      setFilter,
      sortState,
    ],
  );
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
