import type { AssociationPickerOption } from '@carefully-built/association-picker';
import type { DocumentCardItem } from '@carefully-built/files';
import { useState } from 'react';
import { toast } from 'sonner';

import type { Id } from '@convex/_generated/dataModel';

import { useContactsByOrganization } from '@/hooks/use-contacts';
import { useDeleteFile, useFilesByOrganization, useGenerateUploadUrl, useSaveFile } from '@/hooks/use-files';
import { useCurrentUserByOrganization } from '@/hooks/use-users';
import { showDestructiveActionToast } from '@/lib/ui/destructive-action-toast';
import { useOrganization } from '@/providers';

import { getFileUrl, mapFileToDocument, resolveFileAssociations } from './documents.mapping';
import type { StoredFile } from './documents.types';

interface UseDocumentsPageResult {
  readonly associationOptions: AssociationPickerOption[];
  readonly copyDocumentLink: (url: string) => void;
  readonly deleteDocument: (id: Id<'files'>) => void;
  readonly documents: readonly DocumentCardItem<Id<'files'>>[];
  readonly isUploadOpen: boolean;
  readonly openDocument: (document: DocumentCardItem<Id<'files'>>) => void;
  readonly selectedAssociations: readonly string[];
  readonly setIsUploadOpen: (isOpen: boolean) => void;
  readonly setSelectedAssociations: (associations: readonly string[]) => void;
  readonly uploadSelectedFile: (file: File) => Promise<void>;
}

export function useDocumentsPage(): UseDocumentsPageResult {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAssociations, setSelectedAssociations] = useState<readonly string[]>([]);
  const { organizationId } = useOrganization();
  const currentUser = useCurrentUserByOrganization(organizationId);
  const contacts = useContactsByOrganization(organizationId);
  const files = useFilesByOrganization(organizationId) as readonly StoredFile[] | undefined;
  const generateUploadUrl = useGenerateUploadUrl();
  const saveFile = useSaveFile();
  const deleteFile = useDeleteFile();
  const documents = (files ?? []).map(mapFileToDocument);
  const associationOptions: AssociationPickerOption[] = (contacts ?? []).map((contact) => ({
    entityId: String(contact._id),
    entityType: 'contact',
    label: contact.name,
    typeLabel: 'Contact',
    value: `contact:${contact._id}`,
  }));

  function resolveAssociations() {
    return resolveFileAssociations(selectedAssociations, associationOptions);
  }

  function copyDocumentLink(url: string): void {
    void navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied');
    });
  }

  function deleteDocument(id: Id<'files'>): void {
    showDestructiveActionToast({
      message: 'Delete this file?',
      onConfirm: async () => {
        await deleteFile({ id });
        toast.success('File deleted');
      },
    });
  }

  function openDocument(document: DocumentCardItem<Id<'files'>>): void {
    const url = getFileUrl(document);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  async function uploadSelectedFile(file: File): Promise<void> {
    if (!organizationId || !currentUser?._id) {
      toast.error('Cannot upload right now.');
      return;
    }

    const uploadUrl = await generateUploadUrl();
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const { storageId } = (await uploadResponse.json()) as { storageId: Id<'_storage'> };

    await saveFile({
      storageId,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      associations: resolveAssociations(),
      organizationId,
    });

    toast.success('File uploaded');
    setSelectedAssociations([]);
  }

  return {
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
  };
}
