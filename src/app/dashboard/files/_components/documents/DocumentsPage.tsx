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
        {isLoading ? null : documents.length > 0 ? (
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
          <EmptyStateCard
            icon={
              hasSearch || hasFilters ? (
                <SearchX className="size-7" />
              ) : (
                <Files className="size-7" />
              )
            }
            title={hasSearch || hasFilters ? 'No files found' : 'No files yet'}
            subtitle={
              hasSearch || hasFilters
                ? 'Try changing your search or filters.'
                : 'Add your first file to keep workspace documents together.'
            }
            actionLabel={hasSearch || hasFilters ? undefined : 'Add file'}
            actionIcon={hasSearch || hasFilters ? undefined : <Plus className="size-4" />}
            onAction={hasSearch || hasFilters ? undefined : () => setIsUploadOpen(true)}
          />
        )}
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
