import { workos } from './workos';

export interface OrganizationMembership {
  id: string;
  name: string;
  role: string;
}

export async function listUserOrganizations(
  userId: string
): Promise<OrganizationMembership[]> {
  const memberships = await workos.userManagement.listOrganizationMemberships({
    userId,
  });

  return Promise.all(
    memberships.data.map(async (membership) => {
      const organization = await workos.organizations.getOrganization(
        membership.organizationId
      );

      return {
        id: organization.id,
        name: organization.name,
        role: membership.role.slug || 'member',
      };
    })
  );
}

export function getActiveOrganizationId(
  organizations: readonly OrganizationMembership[],
  sessionOrganizationId?: string | null
): string | null {
  if (!organizations.length) {
    return null;
  }

  const currentOrganization = sessionOrganizationId
    ? organizations.find((organization) => organization.id === sessionOrganizationId)
    : undefined;

  return currentOrganization?.id ?? organizations[0]?.id ?? null;
}
