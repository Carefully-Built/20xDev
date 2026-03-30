import type { Doc } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import type { UserIdentity } from 'convex/server';

type OrganizationCtx = MutationCtx | QueryCtx;

function getAuthOrganizationId(identity: UserIdentity | null): string | null {
  const organizationId = identity?.org_id;
  return typeof organizationId === 'string' && organizationId ? organizationId : null;
}

export async function getOrganizationUser(
  ctx: OrganizationCtx,
  organizationId: string
): Promise<Doc<'users'> | null> {
  const identity = await ctx.auth.getUserIdentity();
  const authOrganizationId = getAuthOrganizationId(identity);
  if (!identity || authOrganizationId !== organizationId) {
    return null;
  }

  return ctx.db
    .query('users')
    .withIndex('by_workos_id_and_organization', (q) => (
      q.eq('workosId', identity.subject).eq('organizationId', organizationId)
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
