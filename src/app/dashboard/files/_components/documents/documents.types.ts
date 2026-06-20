import type { Id } from '@convex/_generated/dataModel';

export interface StoredFile {
  readonly _id: Id<'files'>;
  readonly createdAt: number;
  readonly mimeType: string;
  readonly name: string;
  readonly size: number;
  readonly url: string | null;
  readonly associations?: readonly StoredFileAssociation[];
}

export interface StoredFileAssociation {
  readonly entityId: string;
  readonly entityType: 'contact' | 'opportunity';
  readonly label: string;
  readonly typeLabel: string;
  readonly value: string;
}
