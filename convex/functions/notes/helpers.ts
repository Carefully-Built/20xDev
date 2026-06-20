import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

export async function getScopedNote(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'notes'>['_id'],
  organizationId: string,
): Promise<Doc<'notes'>> {
  const note = await ctx.db.get(id);

  if (note?.organizationId !== organizationId) {
    throw new Error('Note not found');
  }

  return note;
}
