interface OrganizationItem {
  organizationId: string;
}

export function filterItemsByOrganization<T extends OrganizationItem>(
  items: T[] | undefined,
  organizationId: string | null | undefined
): T[] | undefined {
  if (!items || !organizationId) {
    return items;
  }
  return items.filter((item) => item.organizationId === organizationId);
}
