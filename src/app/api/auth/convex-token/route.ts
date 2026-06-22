import { NextResponse } from 'next/server';

import { refreshSession } from '@/lib/session';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await refreshSession();

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
