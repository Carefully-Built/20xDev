import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import { getActiveOrganizationId, listUserOrganizations } from '@/lib/organization-memberships';
import { getSession, refreshSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface CreateOrgBody {
  name: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CreateOrgBody;
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Organization name required' }, { status: 400 });
    }

    const org = await workos.organizations.createOrganization({
      name: name.trim(),
    });

    await workos.userManagement.createOrganizationMembership({
      userId: session.user.id,
      organizationId: org.id,
      roleSlug: 'admin',
    });

    await refreshSession(org.id);

    await syncAuthenticatedUser(session.user, org.id);

    return NextResponse.json({
      success: true,
      currentOrganizationId: org.id,
      organizationId: org.id,
      organization: { id: org.id, name: org.name },
    });
  } catch (err) {
    console.error('Error creating organization:', err);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizations = await listUserOrganizations(session.user.id);

    return NextResponse.json({
      organizations,
      currentOrganizationId: getActiveOrganizationId(
        organizations,
        session.organizationId
      ),
    });
  } catch (err) {
    console.error('Error listing organizations:', err);
    return NextResponse.json({ error: 'Failed to list organizations' }, { status: 500 });
  }
}
