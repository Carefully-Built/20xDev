import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

export async function requireUserInOrganization(
  ctx: MutationCtx,
  userId: Id<'users'>,
  organizationId: string
): Promise<void> {
  const user = await ctx.db.get(userId);
  if (user?.organizationId !== organizationId) {
    throw new Error('User not found in organization');
  }
}
