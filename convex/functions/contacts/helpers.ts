import { getActiveOrgRecord, type ConvexCrudCtx } from '@carefully-built/saas-kit/convex-crud';

import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

export async function getScopedContact(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'contacts'>['_id'],
  organizationId: string,
): Promise<Doc<'contacts'>> {
  return getActiveOrgRecord<Doc<'contacts'>>(
    ctx as ConvexCrudCtx,
    id,
    organizationId,
    'Contact not found',
  );
}
