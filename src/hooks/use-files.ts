/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

export function useFilesByOrganization(organizationId: string | undefined | null) {
  return useQuery(
    api.functions.files.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useGenerateUploadUrl() {
  return useMutation(api.functions.files.mutations.generateUploadUrl);
}

export function useSaveFile() {
  return useMutation(api.functions.files.mutations.saveFile);
}

export function useDeleteFile() {
  return useMutation(api.functions.files.mutations.remove);
}
