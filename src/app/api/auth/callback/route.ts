import { handleAuth } from '@workos-inc/authkit-nextjs';

import { syncUserToConvex } from '@/lib/convex-server';

export const GET = handleAuth({
  returnPathname: '/dashboard',
  onSuccess: async ({ organizationId, user }) => {
    await syncUserToConvex({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
      organizationId,
    });
  },
});
