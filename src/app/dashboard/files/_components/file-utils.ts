import type { Id } from '@convex/_generated/dataModel';

export interface FileWithUrl {
  _id: Id<'files'>;
  name: string;
  mimeType: string;
  size: number;
  url: string | null;
  createdAt: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return String(parseFloat((bytes / Math.pow(k, i)).toFixed(2))) + ' ' + String(sizes[i] ?? 'Bytes');
}

export function isPreviewable(mimeType: string): boolean {
  return mimeType.startsWith('image/') || mimeType === 'application/pdf';
}
