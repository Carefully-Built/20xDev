import { syncWorkOSUserToConvex } from './convex-server';

export interface SyncableWorkOSUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}

export async function syncAuthenticatedUser(
  user: SyncableWorkOSUser,
  organizationId?: string | null
): Promise<void> {
  await syncWorkOSUserToConvex(user, organizationId ?? undefined);
}
