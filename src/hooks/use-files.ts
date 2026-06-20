/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';

// ============================================================
// QUERIES
// ============================================================

export function useFile(id: Id<'files'> | undefined | null) {
  return useQuery(api.functions.files.queries.getById, id ? { id } : 'skip');
}

export function useFilesByOrganization(organizationId: string | undefined | null) {
  return useQuery(
    api.functions.files.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip'
  );
}

export function useFilesByType(
  organizationId: string | undefined | null,
  mimeTypePrefix: string
) {
  return useQuery(
    api.functions.files.queries.listByType,
    organizationId ? { organizationId, mimeTypePrefix } : 'skip'
  );
}

// ============================================================
// MUTATIONS
// ============================================================

export function useGenerateUploadUrl() {
  return useMutation(api.functions.files.mutations.generateUploadUrl);
}

export function useSaveFile() {
  return useMutation(api.functions.files.mutations.saveFile);
}

export function useRenameFile() {
  return useMutation(api.functions.files.mutations.rename);
}

export function useDeleteFile() {
  return useMutation(api.functions.files.mutations.remove);
}

// ============================================================
// UPLOAD HELPER
// ============================================================

interface UploadFileParams {
  file: File;
  organizationId: string;
  generateUploadUrl: () => Promise<string>;
  saveFile: (args: {
    storageId: Id<'_storage'>;
    name: string;
    mimeType: string;
    size: number;
    organizationId: string;
  }) => Promise<Id<'files'>>;
}

/**
 * Helper function to handle the full file upload flow
 */
export async function uploadFile({
  file,
  organizationId,
  generateUploadUrl,
  saveFile,
}: UploadFileParams): Promise<Id<'files'>> {
  // Step 1: Get upload URL
  const uploadUrl = await generateUploadUrl();

  // Step 2: Upload file to Convex storage
  const result = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!result.ok) {
    throw new Error('Failed to upload file');
  }

  const { storageId } = (await result.json()) as { storageId: Id<'_storage'> };

  // Step 3: Save file metadata
  return await saveFile({
    storageId,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    organizationId,
  });
}
