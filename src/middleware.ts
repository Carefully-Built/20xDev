import { unsealData } from 'iron-session';
import { NextResponse } from 'next/server';

import type { SessionData } from './lib/session';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/update-password',
  '/privacy',
  '/terms',
  '/api/auth',
  '/api/test-workos',
];

async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionData | null> {
  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie?.value) {
    return null;
  }

  const password = process.env.WORKOS_COOKIE_PASSWORD;
  if (!password) {
    return null;
  }

  try {
    const session = await unsealData<SessionData>(sessionCookie.value, {
      password,
    });
    return session;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const session = await getSessionFromRequest(request);

  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
  ],
};
