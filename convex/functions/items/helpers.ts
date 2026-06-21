import { getActiveOrgRecord, type ConvexCrudCtx } from '@carefully-built/saas-kit/convex-crud';

import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

export async function getScopedItem(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'items'>['_id'],
  organizationId: string,
): Promise<Doc<'items'>> {
  return getActiveOrgRecord<Doc<'items'>>(
    ctx as ConvexCrudCtx,
    id,
    organizationId,
    'Item not found',
  );
}
