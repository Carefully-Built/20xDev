import { NextResponse } from 'next/server';

import type { WidgetScopes } from '@/lib/workos-widgets';
import type { NextRequest } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';


interface TokenRequestBody {
  scopes?: WidgetScopes[];
  organizationId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as TokenRequestBody;
    const { scopes, organizationId } = body;

    if (!scopes || !Array.isArray(scopes)) {
      return NextResponse.json({ error: 'Scopes required' }, { status: 400 });
    }
    if (session.organizationId && session.organizationId !== organizationId) {
      return NextResponse.json({ error: 'Organization mismatch' }, { status: 403 });
    }

    const token = await workos.widgets.getToken({
      userId: session.user.id,
      organizationId,
      scopes,
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error('Error getting widget token:', err);
    return NextResponse.json({ error: 'Failed to get widget token' }, { status: 500 });
  }
}
