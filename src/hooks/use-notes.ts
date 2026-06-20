/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

export function useNotesByOrganization(organizationId: string | null | undefined) {
  return useQuery(
    api.functions.notes.queries.listByOrganization,
    organizationId ? { organizationId } : 'skip',
  );
}

export function useCreateNote() {
  return useMutation(api.functions.notes.mutations.create);
}

export function useUpdateNote() {
  return useMutation(api.functions.notes.mutations.update);
}

export function useDeleteNote() {
  return useMutation(api.functions.notes.mutations.remove);
}
