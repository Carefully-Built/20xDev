import { authKit } from '../../auth';

import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

type ItemCtx = MutationCtx | QueryCtx;

export async function requireOrganizationUser(
  ctx: ItemCtx,
  organizationId: string
): Promise<Doc<'users'>> {
  const authUser = await authKit.getAuthUser(ctx);
  if (!authUser) {
    throw new Error('Unauthorized');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_workos_id', (q) => q.eq('workosId', authUser.id))
    .unique();

  if (user?.organizationId !== organizationId) {
    throw new Error('Forbidden');
  }

  return user;
}
