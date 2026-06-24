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

function getUserName(user: SyncedWorkOSUser): string | undefined {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined;
}

function getSyncedUserFields(user: SyncedWorkOSUser): Pick<Doc<'users'>, 'workosId' | 'email'> & Partial<Pick<Doc<'users'>, 'name' | 'firstName' | 'lastName' | 'imageUrl'>> {
  return {
    workosId: user.workosId,
    email: user.email,
    name: getUserName(user),
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.imageUrl ?? undefined,
  };
}

async function getBaseUserRecord(ctx: MutationCtx, workosId: string): Promise<Doc<'users'> | undefined> {
  const users = await ctx.db
    .query('users')
    .withIndex('by_workos_id', (query) => query.eq('workosId', workosId))
    .collect();

  return users.find((user) => user.organizationId === undefined);
}

export async function upsertUserRecord(
  ctx: MutationCtx,
  user: SyncedWorkOSUser,
  organizationId?: string,
  role: UserRole = 'member',
): Promise<Id<'users'>> {
  const existing = organizationId
    ? await ctx.db
      .query('users')
      .withIndex('by_workos_id_and_organization', (query) => (
        query.eq('workosId', user.workosId).eq('organizationId', organizationId)
      ))
      .unique()
    : await getBaseUserRecord(ctx, user.workosId);

  const updatedAt = Date.now();
  const record = {
    ...getSyncedUserFields(user),
    organizationId,
    role: existing?.role ?? role,
    updatedAt,
  };

  if (existing) {
    await ctx.db.patch(existing._id, record);
    return existing._id;
  }

  return await ctx.db.insert('users', {
    ...record,
    createdAt: updatedAt,
  });
}

export async function patchUserRecords(
  ctx: MutationCtx,
  user: SyncedWorkOSUser,
): Promise<void> {
  const users = await ctx.db
    .query('users')
    .withIndex('by_workos_id', (query) => query.eq('workosId', user.workosId))
    .collect();

  if (users.length === 0) {
    await upsertUserRecord(ctx, user);
    return;
  }

  const patch = {
    ...getSyncedUserFields(user),
    updatedAt: Date.now(),
  };

  await Promise.all(users.map(async (record) => {
    await ctx.db.patch(record._id, patch);
  }));
}

export async function deleteUserRecords(ctx: MutationCtx, workosId: string): Promise<void> {
  const users = await ctx.db
    .query('users')
    .withIndex('by_workos_id', (query) => query.eq('workosId', workosId))
    .collect();

  await Promise.all(users.map(async (user) => {
    await ctx.db.delete(user._id);
  }));
}
