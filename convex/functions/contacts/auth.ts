import { requireOrganizationUser as requireScopedOrganizationUser } from '../../lib/organization_user';

import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

type ContactCtx = MutationCtx | QueryCtx;

export async function requireOrganizationUser(
  ctx: ContactCtx,
  organizationId: string,
): Promise<Doc<'users'>> {
  return requireScopedOrganizationUser(ctx, organizationId);
}
