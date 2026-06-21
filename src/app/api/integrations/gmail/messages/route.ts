import { getGmailAccessToken } from '@/lib/integrations/workos/workos-pipes';
import { getSession } from '@/lib/session';

import type { NextRequest, NextResponse } from 'next/server';

interface GmailListResponse {
  messages?: {
    id?: string;
    threadId?: string;
  }[];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { NextResponse } = await import('next/server');
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = await getGmailAccessToken({
    organizationId: session.organizationId,
    userId: session.user.id,
  });

  if (!token.accessToken) {
    return NextResponse.json({
      connectionError: token.error ?? 'not_installed',
      messages: [],
    });
  }

  const maxResults = request.nextUrl.searchParams.get('maxResults') ?? '10';
  const searchParams = new URLSearchParams({
    maxResults,
  });
  const query = request.nextUrl.searchParams.get('q');
  if (query) {
    searchParams.set('q', query);
  }

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${searchParams.toString()}`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    console.error('Failed to fetch Gmail messages:', body);
    return NextResponse.json({ error: 'Failed to fetch Gmail messages' }, { status: 500 });
  }

  const payload = (await response.json()) as GmailListResponse;
  return NextResponse.json({ messages: payload.messages ?? [] });
}
