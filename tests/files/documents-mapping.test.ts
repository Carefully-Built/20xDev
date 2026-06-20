import { describe, expect, test } from 'bun:test';

import type { DocumentCardItem } from '@carefully-built/files';

import type { Id } from '../../convex/_generated/dataModel';
import { getFileUrl, mapFileToDocument, resolveFileAssociations } from '../../src/app/dashboard/files/_components/documents/documents.mapping';

describe('documents mapping', () => {
  test('maps stored files into document card items', () => {
    expect(
      mapFileToDocument({
        _id: 'file_123' as Id<'files'>,
        associations: [
          {
            entityId: 'contact_123',
            entityType: 'contact',
            label: 'Ada Lovelace',
            typeLabel: 'Contact',
            value: 'contact:contact_123',
          },
        ],
        createdAt: 2000,
        mimeType: 'application/pdf',
        name: 'proposal.pdf',
        size: 128,
        url: 'https://example.com/proposal.pdf',
      }),
    ).toEqual({
      _id: 'file_123',
      associations: [{ label: 'Ada Lovelace', value: 'contact:contact_123' }],
      externalUrl: 'https://example.com/proposal.pdf',
      fileCount: 1,
      fileMimeType: 'application/pdf',
      fileName: 'proposal.pdf',
      fileSize: 128,
      previewUrl: 'https://example.com/proposal.pdf',
      sourceType: 'manual',
      title: 'proposal.pdf',
      updatedAt: 2000,
    });
  });

  test('resolves selected contact association options', () => {
    expect(
      resolveFileAssociations(['contact:contact_123', 'opportunity:opportunity_123'], [
        {
          entityId: 'contact_123',
          entityType: 'contact',
          label: 'Ada Lovelace',
          typeLabel: 'Contact',
          value: 'contact:contact_123',
        },
        {
          entityId: 'opportunity_123',
          entityType: 'opportunity',
          label: 'Website redesign',
          typeLabel: 'Opportunity',
          value: 'opportunity:opportunity_123',
        },
      ]),
    ).toEqual([
      {
        entityId: 'contact_123',
        entityType: 'contact',
        label: 'Ada Lovelace',
        typeLabel: 'Contact',
        value: 'contact:contact_123',
      },
    ]);
  });

  test('prefers preview urls when opening documents', () => {
    const document = {
      previewUrl: 'https://example.com/preview.pdf',
      externalUrl: 'https://example.com/file.pdf',
    } as DocumentCardItem<Id<'files'>>;

    expect(getFileUrl(document)).toBe('https://example.com/preview.pdf');
  });
});
