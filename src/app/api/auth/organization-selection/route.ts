import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import {
  clearPendingOrganizationSelection,
  createSession,
  getPendingOrganizationSelection,
} from '@/lib/session';
import { WORKOS_CLIENT_ID, workos } from '@/lib/workos';

function getSafeRedirectPath(raw: string | null | undefined): string {
  if (!raw?.startsWith('/') || raw.startsWith('//')) {
    return '/dashboard';
  }

  return raw;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const organizationId = request.nextUrl.searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.redirect(new URL('/login?error=missing_organization', request.url));
  }

  const pending = await getPendingOrganizationSelection();

  if (!pending) {
    return NextResponse.redirect(
      new URL('/login?error=organization_selection_expired', request.url)
    );
  }

  const isAllowedOrganization = pending.organizations.some(
    (organization) => organization.id === organizationId
  );

  if (!isAllowedOrganization) {
    await clearPendingOrganizationSelection();
    return NextResponse.redirect(
      new URL('/login?error=invalid_organization_selection', request.url)
    );
  }

  try {
    const { user, accessToken, refreshToken, organizationId: authenticatedOrganizationId } =
      await workos.userManagement.authenticateWithOrganizationSelection({
        clientId: WORKOS_CLIENT_ID,
        organizationId,
        pendingAuthenticationToken: pending.pendingAuthenticationToken,
      });

    await createSession({
      accessToken,
      refreshToken,
      user,
      organizationId: authenticatedOrganizationId,
    });

    await clearPendingOrganizationSelection();

    await syncAuthenticatedUser(user, authenticatedOrganizationId);

    return NextResponse.redirect(new URL(getSafeRedirectPath(pending.redirectPath), request.url));
  } catch (error) {
    console.error('WorkOS organization selection error:', error);
    await clearPendingOrganizationSelection();
    return NextResponse.redirect(
      new URL('/login?error=organization_selection_failed', request.url)
    );
  }
}
