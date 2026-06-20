import type { DocumentCardItem } from '@carefully-built/files';

export const documents: readonly DocumentCardItem[] = [
  {
    _id: 'doc-1',
    associations: [{ label: 'Northstar component rollout', value: 'opp-1' }],
    fileCount: 1,
    fileMimeType: 'application/pdf',
    fileName: 'Project scope.pdf',
    fileSize: 246000,
    sourceType: 'manual',
    title: 'Project scope',
    updatedAt: Date.now() - 1000 * 60 * 40,
  },
  {
    _id: 'doc-2',
    associations: [{ label: 'Valeo CRM migration', value: 'opp-2' }],
    externalUrl: 'https://20xdev.com/documents/link/demo',
    fileCount: 0,
    isPending: true,
    publicUploadUrl: 'https://20xdev.com/documents/link/demo',
    sourceType: 'external_link',
    title: 'Client upload request',
    updatedAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    _id: 'doc-3',
    associations: [{ label: 'Motive Works launch', value: 'opp-3' }],
    collectionFileCount: 3,
    fileCount: 3,
    sourceType: 'external_link',
    title: 'Launch document set',
    updatedAt: Date.now() - 1000 * 60 * 60 * 28,
  },
];
