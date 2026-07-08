import type { AssociationPickerOption } from '@carefully-built/saas-kit/association-picker';
import { useUrlStringFilters } from '@carefully-built/saas-kit/crud';
import type { DocumentCardItem } from '@carefully-built/saas-kit/files';
import { showDestructiveActionToast } from '@carefully-built/saas-kit/resource-kit';
import { useState } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { toast } from 'sonner';

import type { Id } from '@convex/_generated/dataModel';

import { useContactsByOrganization } from '@/hooks/use-contacts';
import {
  useDeleteFile,
  useFilesByOrganization,
  useGenerateUploadUrl,
  useSaveFile,
} from '@/hooks/use-files';
import { useCurrentUserByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';

import {
  buildDocumentAssociationFilterOptions,
  filterDashboardDocuments,
} from './documents.filters';
import { getFileUrl, mapFileToDocument, resolveFileAssociations } from './documents.mapping';
import type { StoredFile } from './documents.types';

const DOCUMENT_URL_FILTERS = [
  { key: 'search', param: 'q', defaultValue: '', clearValue: '' },
  { key: 'association' },
] as const;

interface UseDocumentsPageResult {
  readonly associationOptions: AssociationPickerOption[];
  readonly associationFilterOptions: { readonly label: string; readonly value: string }[];
  readonly clearFilters: () => void;
  readonly copyDocumentLink: (url: string) => void;
  readonly deleteDocument: (id: Id<'files'>) => void;
  readonly documents: readonly DocumentCardItem<Id<'files'>>[];
  readonly getDraftFilterResultCount: (draftValues: Record<string, string>) => number | undefined;
  readonly hasFilters: boolean;
  readonly hasSearch: boolean;
  readonly isLoading: boolean;
  readonly isUploadOpen: boolean;
  readonly openDocument: (document: DocumentCardItem<Id<'files'>>) => void;
  readonly search: string;
  readonly selectedAssociation: string;
  readonly selectedAssociations: readonly string[];
  readonly setSearch: (search: string) => void;
  readonly setSelectedAssociation: (association: string) => void;
  readonly setIsUploadOpen: (isOpen: boolean) => void;
  readonly setSelectedAssociations: (associations: readonly string[]) => void;
  readonly uploadSelectedFile: (file: File) => Promise<void>;
}

function copyDocumentLink(url: string): void {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast.success('Link copied');
    })
    .catch(() => {
      /* ignore */
    });
}

function openDocument(document: DocumentCardItem<Id<'files'>>): void {
  const url = getFileUrl(document);
  if (url) {
    globalThis.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function useDocumentsPage(): UseDocumentsPageResult {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAssociations, setSelectedAssociations] = useState<readonly string[]>([]);
  const urlFilters = useUrlStringFilters(DOCUMENT_URL_FILTERS);
  const [selectedFileId, setSelectedFileId] = useQueryState(
    'fileId',
    parseAsString.withDefault(''),
  );
  const { organizationId } = useOrganization();
  const currentUser = useCurrentUserByOrganization(organizationId);
  const contacts = useContactsByOrganization(organizationId);
  const files = useFilesByOrganization(organizationId) as readonly StoredFile[] | undefined;
  const generateUploadUrl = useGenerateUploadUrl();
  const saveFile = useSaveFile();
  const deleteFile = useDeleteFile();
  const allDocuments = (files ?? []).map(mapFileToDocument);
  const search = urlFilters.values.search;
  const selectedAssociation = urlFilters.values.association;
  const documents = filterDashboardDocuments(allDocuments, {
    association: selectedAssociation,
    fileId: selectedFileId,
    search,
  });
  const associationFilterOptions = buildDocumentAssociationFilterOptions(allDocuments);
  const hasSearch = search.trim().length > 0;
  const hasFilters = selectedAssociation !== 'all' || selectedFileId.trim().length > 0;
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

  function deleteDocument(id: Id<'files'>): void {
    showDestructiveActionToast({
      confirmLabel: 'Delete',
      message: 'Delete this file?',
      onConfirm: async () => {
        await deleteFile({ id });
        toast.success('File deleted');
      },
    });
  }

  function clearFilters(): void {
    urlFilters.clear();
    setSelectedFileId(null).catch(() => {
      /* ignore */
    });
  }

  function getDraftFilterResultCount(draftValues: Record<string, string>): number | undefined {
    if (files === undefined) {
      return undefined;
    }

    const draftFilters = urlFilters.getDraftValues(draftValues);
    return filterDashboardDocuments(allDocuments, {
      association: draftFilters.association,
      fileId: selectedFileId,
      search,
    }).length;
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
    associationFilterOptions,
    clearFilters,
    copyDocumentLink,
    deleteDocument,
    documents,
    getDraftFilterResultCount,
    hasFilters,
    hasSearch,
    isLoading: files === undefined,
    isUploadOpen,
    openDocument,
    search,
    selectedAssociation,
    selectedAssociations,
    setSearch: (value) => {
      setSelectedFileId(null).catch(() => {
        /* ignore */
      });
      urlFilters.setValue('search', value);
    },
    setSelectedAssociation: (value) => {
      setSelectedFileId(null).catch(() => {
        /* ignore */
      });
      urlFilters.setValue('association', value);
    },
    setIsUploadOpen,
    setSelectedAssociations,
    uploadSelectedFile,
  };
}
