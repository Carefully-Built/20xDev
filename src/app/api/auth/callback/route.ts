import type { NextRequest } from 'next/server';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { handleAuth } = await import('@workos-inc/authkit-nextjs');
    const handler = handleAuth({
      returnPathname: '/dashboard',
      onSuccess: async ({ user, organizationId }) => {
        await syncAuthenticatedUser(user, organizationId);
      },
    });
    return handler(request);
  } catch (error) {
    console.error('Auth callback failed:', error);
    return new Response('Authentication unavailable', { status: 503 });
  }
}
