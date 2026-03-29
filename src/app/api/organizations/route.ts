import { refreshSession } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { syncUserOrganizationToConvex } from '@/lib/convex-server';
import { getSession } from '@/lib/session';
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

    await refreshSession({
      organizationId: org.id,
      ensureSignedIn: true,
    });

    await syncUserOrganizationToConvex(session.user.id, org.id);

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

    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    const organizations = await Promise.all(
      memberships.data.map(async (membership) => {
        const org = await workos.organizations.getOrganization(membership.organizationId);
        return {
          id: org.id,
          name: org.name,
          role: membership.role.slug || 'member',
        };
      })
    );

    return NextResponse.json({
      organizations,
      currentOrganizationId: session.organizationId ?? organizations[0]?.id ?? null,
    });
  } catch (err) {
    console.error('Error listing organizations:', err);
    return NextResponse.json({ error: 'Failed to list organizations' }, { status: 500 });
  }
}
