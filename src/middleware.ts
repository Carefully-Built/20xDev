import { createNextMiddleware } from 'gt-next/middleware';
import { unsealData } from 'iron-session';
import { NextResponse } from 'next/server';

import type { SessionData } from './lib/session';
import type { NextRequest } from 'next/server';

// GT locale middleware — handles locale detection and URL prefix routing
const gtMiddleware = createNextMiddleware({
  localeRouting: true,
  prefixDefaultLocale: false,
});

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
  '/blog',
  '/contact',
  '/about',
  '/studio',
];

/**
 * Strip locale prefix from pathname for public path matching.
 * E.g., /it/login -> /login, /en/privacy -> /privacy
 */
function stripLocalePrefix(pathname: string): string {
  const localePattern = /^\/(?:en|it)(\/|$)/;
  const match = pathname.match(localePattern);
  if (match) {
    const rest = pathname.replace(localePattern, '/');
    return rest === '' ? '/' : rest;
  }
  return pathname;
}

function isPublicPath(pathname: string): boolean {
  const stripped = stripLocalePrefix(pathname);
  return PUBLIC_PATHS.some((path) => stripped === path || stripped.startsWith(`${path}/`));
}

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
  // Run GT locale middleware first (sets locale cookie, handles locale routing)
  const gtResponse = gtMiddleware(request);

  // If GT middleware returned a redirect, follow it
  if (gtResponse.headers.get('location')) {
    return gtResponse;
  }

  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return gtResponse;
  }

  // Check if user is authenticated for protected paths
  const session = await getSessionFromRequest(request);

  if (!session) {
    const strippedPath = stripLocalePrefix(pathname);
    const url = new URL('/login', request.url);
    url.searchParams.set('from', strippedPath);
    return NextResponse.redirect(url);
  }

  return gtResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|monitoring|favicon.ico|.*\\..*|api/webhooks).*)',
  ],
};
