import { createSuperAdminPage } from '@carefully-built/saas-kit/next';
import { api } from '@convex/_generated/api';

import { convexServer } from '@/lib/convex-server';
import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import { createSession, getSession } from '@/lib/session';
import { SUPER_ADMIN_EMAILS_ENV } from '@/lib/super-admin-access';
import { WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI, workos } from '@/lib/workos';

async function getOrganizationLogoUrl(organizationId: string): Promise<string | null> {
  if (!convexServer) {
    return null;
  }

  const organization = await convexServer.query(api.functions.organizations.queries.getByWorkosId, {
    workosId: organizationId,
  });

  return organization?.logoUrl ?? null;
}

const SuperAdminPage = createSuperAdminPage({
  access: {
    allowedEmailsEnv: SUPER_ADMIN_EMAILS_ENV,
    fallbackPath: '/dashboard',
    loginPath: '/login',
  },
  basePath: '/super-admin',
  enterPath: '/dashboard',
  getOrganizationLogoUrl,
  getRedirectUri: () => Promise.resolve(WORKOS_REDIRECT_URI),
  session: {
    createSession,
    getSession,
  },
  syncUser: syncAuthenticatedUser,
  workos,
  workosClientId: WORKOS_CLIENT_ID,
});

export const dynamic = 'force-dynamic';

export default SuperAdminPage;
