import { createWorkOSWidgetTokenResponse, type WidgetScopes } from '@carefully-built/saas-kit/server';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface TokenRequestBody {
  scopes?: WidgetScopes[];
  organizationId: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const session = await getSession();
    const body = (await request.json()) as TokenRequestBody;
    const { scopes, organizationId } = body;

    if (!scopes || !Array.isArray(scopes)) {
      return NextResponse.json({ error: 'Scopes required' }, { status: 400 });
    }

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization required' }, { status: 400 });
    }

    if (session?.organizationId && session.organizationId !== organizationId) {
      return NextResponse.json({ error: 'Organization mismatch' }, { status: 403 });
    }

    return await createWorkOSWidgetTokenResponse({
      errorMessage: 'Failed to get widget token',
      getSession: () => Promise.resolve(session),
      getToken: async ({ userId }) =>
        workos.widgets.getToken({
          userId,
          organizationId,
          scopes,
        }),
      logContext: 'get widget token',
    });
  } catch (err) {
    console.error('Error getting widget token:', err);
    return NextResponse.json({ error: 'Failed to get widget token' }, { status: 500 });
  }
}
