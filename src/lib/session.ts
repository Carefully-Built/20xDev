import type { UserInfo } from '@workos-inc/authkit-nextjs';

export type SessionData = UserInfo;

function hasWorkOSEnv(): boolean {
  return Boolean(
    process.env.WORKOS_API_KEY
    && process.env.WORKOS_CLIENT_ID
    && process.env.WORKOS_COOKIE_PASSWORD
    && process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI
  );
}

export async function getSession(): Promise<SessionData | null> {
  if (!hasWorkOSEnv()) {
    console.warn('WorkOS env incomplete - returning null session');
    return null;
  }

  try {
    const { withAuth } = await import('@workos-inc/authkit-nextjs');
    const session = await withAuth();
    return session.user ? session : null;
  } catch (error) {
    console.error('Failed to resolve WorkOS session:', error);
    return null;
  }
}
