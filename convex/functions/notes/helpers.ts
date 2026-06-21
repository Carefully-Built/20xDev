import { getActiveOrgRecord, type ConvexCrudCtx } from '@carefully-built/convex-crud';

import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

export async function getScopedNote(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'notes'>['_id'],
  organizationId: string,
): Promise<Doc<'notes'>> {
  return getActiveOrgRecord<Doc<'notes'>>(
    ctx as ConvexCrudCtx,
    id,
    organizationId,
    'Note not found',
  );
}
