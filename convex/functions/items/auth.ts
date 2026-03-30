import { requireOrganizationUser as requireScopedOrganizationUser } from '../../lib/organization_user';

import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

type ItemCtx = MutationCtx | QueryCtx;

export async function requireOrganizationUser(
  ctx: ItemCtx,
  organizationId: string
): Promise<Doc<'users'>> {
  return requireScopedOrganizationUser(ctx, organizationId);
}
