import type { AssociationPickerOption } from '@carefully-built/saas-kit/association-picker';
import type { DocumentCardItem } from '@carefully-built/saas-kit/files';

import type { Id } from '@convex/_generated/dataModel';

import type { StoredFile, StoredFileAssociation } from './documents.types';

export function getFileUrl(document: DocumentCardItem<Id<'files'>>): string | null {
  return document.previewUrl ?? document.externalUrl ?? null;
}

export function mapFileToDocument(file: StoredFile): DocumentCardItem<Id<'files'>> {
  return {
    _id: file._id,
    associations: file.associations?.map((association) => ({
      label: association.label,
      value: association.value,
    })),
    externalUrl: file.url,
    fileCount: 1,
    fileMimeType: file.mimeType,
    fileName: file.name,
    fileSize: file.size,
    previewUrl: file.url,
    sourceType: 'manual',
    title: file.name,
    updatedAt: file.createdAt,
  };
}

export function resolveFileAssociations(
  selectedAssociations: readonly string[],
  associationOptions: readonly AssociationPickerOption[],
): StoredFileAssociation[] {
  return selectedAssociations.flatMap((value) => {
    const option = associationOptions.find((association) => association.value === value);
    if (option?.entityType !== 'contact') {
      return [];
    }

    return [
      {
        entityId: option.entityId,
        entityType: option.entityType,
        label: option.label,
        typeLabel: option.typeLabel,
        value: option.value,
      },
    ];
  });
}
