import { withAuth } from '@workos-inc/authkit-nextjs';

import type { UserInfo } from '@workos-inc/authkit-nextjs';

export type SessionData = UserInfo;

export async function getSession(): Promise<SessionData | null> {
  const session = await withAuth();
  return session.user ? session : null;
}
