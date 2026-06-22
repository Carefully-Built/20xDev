import { api } from '@convex/_generated/api';

import { convexServer } from './convex-server';
import { workos } from './workos';

interface OrganizationMembership {
  id: string;
  logoUrl?: string | null;
  name: string;
  role: string;
}

async function getOrganizationLogoUrl(workosId: string): Promise<string | null> {
  if (!convexServer) {
    return null;
  }

  try {
    const organization = await convexServer.query(api.functions.organizations.queries.getByWorkosId, {
      workosId,
    });

    return organization?.logoUrl ?? null;
  } catch (error) {
    console.error('Error loading organization logo:', error);
    return null;
  }
}

export async function listUserOrganizations(userId: string): Promise<OrganizationMembership[]> {
  const memberships = await workos.userManagement.listOrganizationMemberships({
    userId,
  });

  return Promise.all(
    memberships.data.map(async (membership) => {
      const organization = await workos.organizations.getOrganization(membership.organizationId);
      const logoUrl = await getOrganizationLogoUrl(organization.id);

      return {
        id: organization.id,
        logoUrl,
        name: organization.name,
        role: membership.role.slug || 'member',
      };
    }),
  );
}

export function getActiveOrganizationId(
  organizations: readonly OrganizationMembership[],
  sessionOrganizationId?: string | null,
): string | null {
  if (!organizations.length) {
    return null;
  }

  const currentOrganization = sessionOrganizationId
    ? organizations.find((organization) => organization.id === sessionOrganizationId)
    : undefined;

  return currentOrganization?.id ?? organizations[0]?.id ?? null;
}
