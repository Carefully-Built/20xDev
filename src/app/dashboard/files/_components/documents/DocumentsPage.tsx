'use client';

import { DashboardPageLayout } from '@carefully-built/app-shell';
import { AssociationPicker } from '@carefully-built/association-picker';
import { DocumentCard, DocumentCardGrid, FileUploadSheet } from '@carefully-built/files';
import { Button, Label } from '@carefully-built/ui';
import { Plus } from 'lucide-react';

import type { Id } from '@convex/_generated/dataModel';

import { useDocumentsPage } from './useDocumentsPage';

export function DocumentsPage(): React.ReactElement {
  const {
    associationOptions,
    copyDocumentLink,
    deleteDocument,
    documents,
    isUploadOpen,
    openDocument,
    selectedAssociations,
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
      <DocumentCardGrid>
        {documents.map((document) => (
          <DocumentCard<Id<'files'>>
            key={document._id}
            document={document}
            onCopyLink={copyDocumentLink}
            onDelete={deleteDocument}
            onEdit={openDocument}
          />
        ))}
      </DocumentCardGrid>
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
              value={[...selectedAssociations]}
            />
          </div>
        }
        onOpenChange={setIsUploadOpen}
        onUpload={uploadSelectedFile}
        open={isUploadOpen}
      />
    </DashboardPageLayout>
  );
}
