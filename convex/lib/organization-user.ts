import { authKit } from '../auth';

import type { Doc } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

type OrganizationCtx = MutationCtx | QueryCtx;

export async function getOrganizationUser(
  ctx: OrganizationCtx,
  organizationId: string
): Promise<Doc<'users'> | null> {
  const authUser = await authKit.getAuthUser(ctx);
  if (!authUser) {
    return null;
  }

  return ctx.db
    .query('users')
    .withIndex('by_workos_id_and_organization', (q) => (
      q.eq('workosId', authUser.id).eq('organizationId', organizationId)
    ))
    .unique();
}

export async function requireOrganizationUser(
  ctx: OrganizationCtx,
  organizationId: string
): Promise<Doc<'users'>> {
  const user = await getOrganizationUser(ctx, organizationId);
  if (!user) {
    throw new Error('Forbidden');
  }
  return user;
}
