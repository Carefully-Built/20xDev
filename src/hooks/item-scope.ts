export type ScopedOrganizationId = string | null | undefined;

export function requireOrganizationId(
  organizationId: ScopedOrganizationId
): string {
  if (!organizationId) {
    throw new Error('No organization selected.');
  }
  return organizationId;
}

export function getOrganizationQueryArgs(
  organizationId: ScopedOrganizationId
): { organizationId: string } | 'skip';
export function getOrganizationQueryArgs<T extends Record<string, unknown>>(
  organizationId: ScopedOrganizationId,
  args: T
): ({ organizationId: string } & T) | 'skip';
export function getOrganizationQueryArgs(
  organizationId: ScopedOrganizationId,
  args?: Record<string, unknown>
): Record<string, unknown> | 'skip' {
  if (!organizationId) {
    return 'skip';
  }
  if (!args) {
    return { organizationId };
  }
  return { ...args, organizationId };
}
