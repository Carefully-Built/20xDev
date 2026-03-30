import { handleAuth } from '@workos-inc/authkit-nextjs';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';

export const GET = handleAuth({
  returnPathname: '/dashboard',
  onSuccess: async ({ user, organizationId }) => {
    await syncAuthenticatedUser(user, organizationId);
  },
});
