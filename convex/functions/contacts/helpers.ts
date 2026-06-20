import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

function isContactInOrganization(
  contact: Doc<'contacts'> | null,
  organizationId: string,
): contact is Doc<'contacts'> {
  return contact !== null && contact.organizationId === organizationId;
}

export async function getScopedContact(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'contacts'>['_id'],
  organizationId: string,
): Promise<Doc<'contacts'>> {
  const contact = await ctx.db.get(id);

  if (!isContactInOrganization(contact, organizationId)) {
    throw new Error('Contact not found');
  }

  return contact;
}
