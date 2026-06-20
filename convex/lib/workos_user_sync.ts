import {
  deleteWorkosUserRecords,
  patchWorkosUserRecords,
  upsertWorkosUserRecord,
} from '@carefully-built/convex-workos';

import type { Id, Doc } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export interface SyncedWorkOSUser {
  workosId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

type UserRole = Doc<'users'>['role'];

export async function upsertUserRecord(
  ctx: MutationCtx,
  user: SyncedWorkOSUser,
  organizationId?: string,
  role: UserRole = 'member',
): Promise<Id<'users'>> {
  return await upsertWorkosUserRecord({
    ctx,
    tableName: 'users',
    user,
    organizationId,
    role,
  }) as Id<'users'>;
}

export async function patchUserRecords(
  ctx: MutationCtx,
  user: SyncedWorkOSUser,
): Promise<void> {
  await patchWorkosUserRecords({ ctx, tableName: 'users', user });
}

export async function deleteUserRecords(ctx: MutationCtx, workosId: string): Promise<void> {
  await deleteWorkosUserRecords({ ctx, tableName: 'users', workosId });
}
