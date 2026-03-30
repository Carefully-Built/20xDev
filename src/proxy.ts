import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function hasWorkOSEnv(): boolean {
  return Boolean(
    process.env.WORKOS_API_KEY
    && process.env.WORKOS_CLIENT_ID
    && process.env.WORKOS_COOKIE_PASSWORD
    && process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI
  );
}

export default async function proxy(request: NextRequest) {
  if (!hasWorkOSEnv()) {
    return NextResponse.next();
  }

  const { authkitMiddleware } = await import('@workos-inc/authkit-nextjs');
  const middleware = authkitMiddleware({
    signUpPaths: ['/signup', '/signup/email'],
  });
  return (middleware as (request: NextRequest, event: unknown) => Response | Promise<Response | undefined> | undefined)(request, {}) ?? NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\..*|api/webhooks).*)',
  ],
};
