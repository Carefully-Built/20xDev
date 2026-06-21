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
}

function getUserName(user: SyncUserParams): string | undefined {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined;
}

async function syncConvexUser(
  user: SyncUserParams,
  organizationId?: string,
): Promise<Id<'users'> | null> {
  if (!convexServer) {
    console.warn('Convex not configured - skipping user sync');
    return null;
  }

  return convexServer.mutation(api.functions.users.mutations.syncFromWorkOS, {
    workosId: user.id,
    email: user.email,
    name: getUserName(user),
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.profilePictureUrl ?? undefined,
    organizationId,
    role: 'member',
  });
}

export async function syncWorkOSUserToConvex(
  user: SyncUserParams,
  organizationId?: string,
): Promise<Id<'users'> | null> {
  const syncedUser = await syncConvexUser(user);
  if (!organizationId) {
    return syncedUser;
  }
  return syncConvexUser(user, organizationId);
}
