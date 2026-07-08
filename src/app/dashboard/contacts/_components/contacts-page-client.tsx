'use client';

import { DashboardPageLayout, ResponsivePageActions } from '@carefully-built/saas-kit/app-shell';
import { CrudTableView } from '@carefully-built/saas-kit/crud';
import { ContactsImportSheet } from '@carefully-built/saas-kit/import-export';
import { EmptyStateCard } from '@carefully-built/saas-kit';
import { Download, FileUp, Plus, SearchX, UsersRound } from 'lucide-react';

import { ContactFormSheet } from './contact-form-sheet';
import { useContactsPage } from './useContactsPage';

export function ContactsPageClient(): React.ReactElement {
  const contactsPage = useContactsPage();

  return (
    <DashboardPageLayout
      actions={
        <ResponsivePageActions
          primaryAction={{
            icon: <Plus className="size-4" />,
            label: 'Add contact',
            onClick: contactsPage.openCreateSheet,
          }}
          secondaryActions={[
            {
              icon: <FileUp className="size-4" />,
              label: 'Import',
              onClick: () => contactsPage.importState.setIsImportSheetOpen(true),
            },
            {
              icon: <Download className="size-4" />,
              label: 'Export',
              onClick: contactsPage.exportContacts,
            },
          ]}
        />
      }
      title="Contacts"
    >
      <CrudTableView
        state={contactsPage.tableState}
        filters={contactsPage.filters}
        searchPlaceholder="Search contacts..."
        actions={['edit', 'delete']}
        actionHandlers={{
          onDelete: contactsPage.requestDelete,
          onEdit: contactsPage.openEditSheet,
        }}
        columns={contactsPage.columns}
        getRowKey={(contact) => contact._id}
        onRowClick={(contact) => {
          contactsPage.router.push(`/dashboard/contacts/${contact._id}`);
        }}
        isLoading={contactsPage.isLoading}
        noDataMessage="No contacts yet"
        initialEmptyContent={
          <EmptyStateCard
            icon={<UsersRound className="size-7" />}
            title="No contacts yet"
            subtitle="Add your first contact to start building the workspace history."
            actionLabel="Add contact"
            actionIcon={<Plus className="size-4" />}
            onAction={contactsPage.openCreateSheet}
          />
        }
        noResultsContent={
          <EmptyStateCard
            icon={<SearchX className="size-7" />}
            title="No contacts found"
            subtitle="Try changing your search or filters."
          />
        }
      />
      <ContactFormSheet
        contact={contactsPage.editingContact}
        loading={contactsPage.isSaving}
        open={contactsPage.isSheetOpen}
        onOpenChange={contactsPage.setIsSheetOpen}
        onSubmit={contactsPage.saveContact}
        users={contactsPage.users}
      />
      <ContactsImportSheet
        open={contactsPage.importState.isImportSheetOpen}
        onOpenChange={contactsPage.importState.syncImportSheetOpen}
        overwriteExisting={contactsPage.importState.overwriteExisting}
        onOverwriteExistingChange={contactsPage.importState.setOverwriteExisting}
        onDownloadTemplate={contactsPage.importState.downloadCsvTemplate}
        onFileSelected={(file) => {
          contactsPage.importState.parseImportFile(file).catch(() => {
            /* ignore */
          });
        }}
        onConfirmImport={() => {
          contactsPage.confirmImport().catch(() => {
            /* ignore */
          });
        }}
        previewSummary={contactsPage.importState.importPreviewSummary}
        fileName={contactsPage.importState.selectedImportFileName}
        isParsing={contactsPage.importState.isParsingImportFile}
        isImporting={contactsPage.isImporting}
        rows={contactsPage.importState.importPreviewRows}
        fileError={contactsPage.importState.importFileError}
      />
    </DashboardPageLayout>
  );
}
