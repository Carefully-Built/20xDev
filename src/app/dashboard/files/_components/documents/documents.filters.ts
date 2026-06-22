import { filterDocuments, type DocumentCardItem } from '@carefully-built/saas-kit/files';

import type { Id } from '@convex/_generated/dataModel';

export interface DashboardDocumentFilterOptions {
  readonly association: string;
  readonly fileId: string;
  readonly search: string;
}

export function filterDashboardDocuments(
  documents: readonly DocumentCardItem<Id<'files'>>[],
  options: DashboardDocumentFilterOptions,
): DocumentCardItem<Id<'files'>>[] {
  const selectedFile = options.fileId
    ? documents.find((document) => String(document._id) === options.fileId)
    : null;

  if (selectedFile) {
    return [selectedFile];
  }

  return filterDocuments([...documents], {
    association: options.association,
    search: options.search,
    tag: 'all',
  });
}

export function buildDocumentAssociationFilterOptions(
  documents: readonly DocumentCardItem<Id<'files'>>[],
): { readonly label: string; readonly value: string }[] {
  const optionsByValue = new Map<string, string>();

  for (const document of documents) {
    for (const association of document.associations ?? []) {
      optionsByValue.set(association.value, association.label);
    }
  }

  return [...optionsByValue.entries()].map(([value, label]) => ({ label, value }));
}
