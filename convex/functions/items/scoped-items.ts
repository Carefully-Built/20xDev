import type { Doc } from '../../_generated/dataModel';

export function filterItemsByOrganization(
  items: Doc<'items'>[],
  organizationId: string
): Doc<'items'>[] {
  return items.filter((item) => item.organizationId === organizationId);
}
