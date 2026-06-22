import { describe, expect, test } from 'bun:test';

import type { DocumentCardItem } from '@carefully-built/saas-kit/files';

import type { Id } from '../../convex/_generated/dataModel';
import {
  buildDocumentAssociationFilterOptions,
  filterDashboardDocuments,
} from '../../src/app/dashboard/files/_components/documents/documents.filters';

const documents = [
  {
    _id: 'file_a' as Id<'files'>,
    associations: [{ label: 'Ada Lovelace', value: 'contact:ada' }],
    fileCount: 1,
    fileName: 'proposal.pdf',
    sourceType: 'manual',
    title: 'proposal.pdf',
  },
  {
    _id: 'file_b' as Id<'files'>,
    associations: [{ label: 'Grace Hopper', value: 'contact:grace' }],
    fileCount: 1,
    fileName: 'invoice.pdf',
    sourceType: 'manual',
    title: 'invoice.pdf',
  },
] satisfies DocumentCardItem<Id<'files'>>[];

describe('documents filters', () => {
  test('narrows results to the selected file id', () => {
    expect(
      filterDashboardDocuments(documents, {
        association: 'all',
        fileId: 'file_b',
        search: '',
      }),
    ).toEqual([documents[1]]);
  });

  test('filters documents by search and association', () => {
    expect(
      filterDashboardDocuments(documents, {
        association: 'contact:ada',
        fileId: '',
        search: 'proposal',
      }),
    ).toEqual([documents[0]]);
  });

  test('builds unique association filter options', () => {
    expect(buildDocumentAssociationFilterOptions(documents)).toEqual([
      { label: 'Ada Lovelace', value: 'contact:ada' },
      { label: 'Grace Hopper', value: 'contact:grace' },
    ]);
  });
});
