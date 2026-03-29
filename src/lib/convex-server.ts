import { api } from '@convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

import type { Id } from '@convex/_generated/dataModel';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export const convexServer = convexUrl ? new ConvexHttpClient(convexUrl) : null;

interface SyncUserParams {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
  organizationId?: string;
}

export async function syncUserToConvex(user: SyncUserParams): Promise<Id<'users'> | null> {
  if (!convexServer) {
    console.warn('Convex not configured - skipping user sync');
    return null;
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined;

  return convexServer.mutation(api.functions.users.mutations.syncFromWorkOS, {
    workosId: user.id,
    email: user.email,
    name,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.profilePictureUrl ?? undefined,
    organizationId: user.organizationId,
    role: 'member',
  });
}

export async function syncUserOrganizationToConvex(
  user: SyncUserParams,
  organizationId?: string
): Promise<Id<'users'> | null> {
  if (!convexServer) {
    console.warn('Convex not configured - skipping organization sync');
    return null;
  }

  return convexServer.mutation(api.functions.users.mutations.syncFromWorkOS, {
    workosId: user.id,
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.profilePictureUrl ?? undefined,
    organizationId,
    role: 'member',
  });
}
