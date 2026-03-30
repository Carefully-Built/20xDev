import { refreshSession } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import { listUserOrganizations } from '@/lib/organization-memberships';
import { getSession } from '@/lib/session';
import { workos, WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI } from '@/lib/workos';

interface SwitchOrgBody {
  organizationId: string;
}

interface OrgDomain {
  state: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as SwitchOrgBody;
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    const organizations = await listUserOrganizations(session.user.id);
    const targetOrganization = organizations.find((organization) => organization.id === organizationId);

    if (!targetOrganization) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const org = await workos.organizations.getOrganization(organizationId);
    const domains = org.domains as OrgDomain[] | undefined;
    const requiresSSO = domains?.some((d) => d.state === 'verified') ?? false;

    if (requiresSSO) {
      const authUrl = workos.userManagement.getAuthorizationUrl({
        clientId: WORKOS_CLIENT_ID,
        redirectUri: WORKOS_REDIRECT_URI,
        organizationId,
        provider: 'authkit',
      });

      return NextResponse.json({ redirectUrl: authUrl });
    }

    await refreshSession({
      organizationId,
      ensureSignedIn: true,
    });

    await syncAuthenticatedUser(session.user, organizationId);

    return NextResponse.json({ success: true, organizationId });
  } catch (err) {
    console.error('Error switching organization:', err);
    return NextResponse.json({ error: 'Failed to switch organization' }, { status: 500 });
  }
}
