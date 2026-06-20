import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getSession, refreshSession } from '@/lib/session';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === '1';
    const session = forceRefresh ? await refreshSession() : await getSession();

    if (!session?.accessToken) {
      return NextResponse.json({ token: null }, { status: 401 });
    }

    return NextResponse.json({
      organizationId: session.organizationId ?? null,
      token: session.accessToken,
    });
  } catch (error) {
    console.error('Failed to resolve data auth token:', error);
    return NextResponse.json({ token: null }, { status: 401 });
  }
}
