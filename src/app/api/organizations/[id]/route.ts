import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { listUserOrganizations } from '@/lib/organization-memberships';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface UpdateOrgBody {
  name: string;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ADMIN_ROLE_HINTS = ['admin', 'owner'] as const;

async function canManageOrganization(userId: string, organizationId: string): Promise<boolean> {
  const organizations = await listUserOrganizations(userId);
  const organization = organizations.find((item) => item.id === organizationId);

  return Boolean(
    organization &&
      ADMIN_ROLE_HINTS.some((hint) => organization.role.toLowerCase().includes(hint)),
  );
}

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateOrgBody;

    if (!(await canManageOrganization(session.user.id, id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Organization name required' }, { status: 400 });
    }

    const org = await workos.organizations.updateOrganization({
      organization: id,
      name: body.name.trim(),
    });

    return NextResponse.json({ success: true, organization: org });
  } catch (err) {
    console.error('Error updating organization:', err);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!(await canManageOrganization(session.user.id, id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await workos.organizations.deleteOrganization(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting organization:', err);
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
}
