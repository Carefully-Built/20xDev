import { redirect } from 'next/navigation';

import { DashboardShell } from './_components/dashboard-shell';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import { getActiveOrganizationId, listUserOrganizations } from '@/lib/organization-memberships';
import { getSession } from '@/lib/session';
import { ConvexClientProvider, OrganizationProvider, UserProvider } from '@/providers';

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const organizations = await listUserOrganizations(session.user.id).catch((error: unknown) => {
    console.error('Error loading organizations:', error);
    return [];
  });
  const organizationId = getActiveOrganizationId(organizations, session.organizationId);

  try {
    await syncAuthenticatedUser(session.user, organizationId);
  } catch (error) {
    console.error('Error syncing authenticated user:', error);
  }

  const name =
    `${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim() || session.user.email;

  return (
    <ConvexClientProvider>
      <OrganizationProvider initialOrganizationId={organizationId ?? undefined}>
        <UserProvider
          initialUser={{
            email: session.user.email,
            firstName: session.user.firstName ?? undefined,
            id: session.user.id,
            imageUrl: session.user.profilePictureUrl ?? undefined,
            lastName: session.user.lastName ?? undefined,
            name,
            organizationId: organizationId ?? undefined,
          }}
        >
          <DashboardShell
            initialOrganizationId={organizationId}
            initialOrganizations={organizations}
          >
            {children}
          </DashboardShell>
        </UserProvider>
      </OrganizationProvider>
    </ConvexClientProvider>
  );
}
