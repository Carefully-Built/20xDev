import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

/**
 * Widget scopes for Profile, Security, and Team widgets
 */
const WIDGET_SCOPES = [
  'widgets:users-table:manage',
  'widgets:api-keys:manage', 
  'widgets:domain-verification:manage',
  'widgets:sso:manage',
] as const;

/**
 * GET /api/auth/token
 * Returns widget token for WorkOS widgets (1 hour expiry)
 */
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const organizationId = session.organizationId;
    if (!organizationId) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      );
    }

    const token = await workos.widgets.getToken({
      userId: session.user.id,
      organizationId,
      scopes: [...WIDGET_SCOPES],
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error getting token:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}
