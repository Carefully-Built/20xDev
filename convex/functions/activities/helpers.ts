import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

export async function getScopedActivity(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'activities'>['_id'],
  organizationId: string,
): Promise<Doc<'activities'>> {
  const activity = await ctx.db.get(id);

  if (activity?.organizationId !== organizationId) {
    throw new Error('Activity not found');
  }

  return activity;
}

export async function listUsersById(
  ctx: QueryCtx,
  ids: readonly Doc<'users'>['_id'][],
): Promise<Map<string, Doc<'users'>>> {
  const users = await Promise.all(ids.map((id) => ctx.db.get(id)));
  return new Map(users.flatMap((user) => (user ? [[String(user._id), user]] : [])));
}

export function formatUserName(user: Doc<'users'> | undefined): string {
  return user?.name ?? user?.email ?? 'User';
}
