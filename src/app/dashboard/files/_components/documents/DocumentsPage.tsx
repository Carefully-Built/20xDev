'use client';

import { DashboardPageLayout } from '@carefully-built/saas-kit/app-shell';
import { AssociationPicker } from '@carefully-built/saas-kit/association-picker';
import { DocumentCard, DocumentCardGrid, FileUploadSheet } from '@carefully-built/saas-kit/files';
import { Button, EmptyStateCard, Label, TableToolbar } from '@carefully-built/saas-kit';
import { Files, Plus, SearchX } from 'lucide-react';

import type { Id } from '@convex/_generated/dataModel';

import {
  associationPickerLabels,
  buildAllOptionLabel,
  documentCardLabels,
  fileUploadSheetLabels,
  tableToolbarLabels,
} from '@/lib/toolkit-labels';

import { useDocumentsPage } from './useDocumentsPage';

function DocumentsEmptyState({
  hasQuery,
  onAddFile,
}: Readonly<{ hasQuery: boolean; onAddFile: () => void }>): React.ReactElement {
  return (
    <EmptyStateCard
      icon={hasQuery ? <SearchX className="size-7" /> : <Files className="size-7" />}
      title={hasQuery ? 'No files found' : 'No files yet'}
      subtitle={
        hasQuery
          ? 'Try changing your search or filters.'
          : 'Add your first file to keep workspace documents together.'
      }
      actionLabel={hasQuery ? undefined : 'Add file'}
      actionIcon={hasQuery ? undefined : <Plus className="size-4" />}
      onAction={hasQuery ? undefined : onAddFile}
    />
  );
}

export function DocumentsPage(): React.ReactElement {
  const {
    associationOptions,
    associationFilterOptions,
    clearFilters,
    copyDocumentLink,
    deleteDocument,
    documents,
    getDraftFilterResultCount,
    hasFilters,
    hasSearch,
    isLoading,
    isUploadOpen,
    openDocument,
    search,
    selectedAssociation,
    selectedAssociations,
    setSearch,
    setSelectedAssociation,
    setIsUploadOpen,
    setSelectedAssociations,
    uploadSelectedFile,
  } = useDocumentsPage();

  const hasQuery = hasSearch || hasFilters;

  let documentsContent: React.ReactNode = null;
  if (!isLoading) {
    documentsContent =
      documents.length > 0 ? (
        <DocumentCardGrid>
          {documents.map((document) => (
            <DocumentCard<Id<'files'>>
              key={document._id}
              document={document}
              onCopyLink={copyDocumentLink}
              onDelete={deleteDocument}
              onEdit={openDocument}
              labels={documentCardLabels}
            />
          ))}
        </DocumentCardGrid>
      ) : (
        <DocumentsEmptyState hasQuery={hasQuery} onAddFile={() => setIsUploadOpen(true)} />
      );
  }

  return (
    <DashboardPageLayout
      fillViewport={false}
      title="Files"
      actions={
        <Button
          size="sm"
          onClick={() => {
            setIsUploadOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add file
        </Button>
      }
    >
      <div className="space-y-4">
        <TableToolbar
          labels={tableToolbarLabels}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: 'Search files...',
          }}
          filters={[
            {
              config: {
                key: 'association',
                label: 'Contact',
                options: associationFilterOptions,
              },
              allOptionLabel: buildAllOptionLabel('Contact'),
              onChange: setSelectedAssociation,
              value: selectedAssociation,
            },
          ]}
          getDraftResultCount={getDraftFilterResultCount}
          onClearAll={clearFilters}
        />
        {documentsContent}
      </div>
      <FileUploadSheet
        associationField={
          <div className="space-y-2">
            <Label>Contact</Label>
            <AssociationPicker
              allowedEntityTypes={['contact']}
              maxSelections={1}
              onChange={setSelectedAssociations}
              options={associationOptions}
              placeholder="Assign a contact"
              searchPlaceholder="Search contacts..."
              labels={associationPickerLabels}
              value={[...selectedAssociations]}
            />
          </div>
        }
        onOpenChange={setIsUploadOpen}
        onUpload={uploadSelectedFile}
        open={isUploadOpen}
        {...fileUploadSheetLabels}
      />
    </DashboardPageLayout>
  );
}
