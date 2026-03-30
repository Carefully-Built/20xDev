import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

function isItemInOrganization(
  item: Doc<'items'> | null,
  organizationId: string
): item is Doc<'items'> {
  return item !== null && item.organizationId === organizationId;
}

export async function getScopedItem(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'items'>['_id'],
  organizationId: string
): Promise<Doc<'items'>> {
  const item = await ctx.db.get(id);
  if (!isItemInOrganization(item, organizationId)) {
    throw new Error('Item not found');
  }
  return item;
}
