import { redirect } from 'next/navigation';

import { DashboardShell } from './_components/dashboard-shell';
import { NoOrgView } from './_components/no-org-view';

import { TooltipProvider } from '@/components/ui/tooltip';
import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import { getActiveOrganizationId, listUserOrganizations } from '@/lib/organization-memberships';
import { getSession } from '@/lib/session';

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const organizations = await listUserOrganizations(session.user.id).catch((error: unknown) => {
    console.error('Error checking organization:', error);
    return [];
  });
  const organizationId = getActiveOrganizationId(organizations, session.organizationId) ?? undefined;

  if (!organizations.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <NoOrgView />
      </div>
    );
  }

  try {
    await syncAuthenticatedUser(session.user, organizationId);
  } catch (error) {
    console.error('Error syncing authenticated user to Convex:', error);
  }

  const userInfo = {
    id: session.user.id,
    email: session.user.email,
    firstName: session.user.firstName ?? undefined,
    lastName: session.user.lastName ?? undefined,
    profilePictureUrl: session.user.profilePictureUrl ?? undefined,
    organizationId,
    name: `${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim() || session.user.email,
    imageUrl: session.user.profilePictureUrl ?? undefined,
  };

  return (
    <TooltipProvider>
      <DashboardShell user={userInfo}>{children}</DashboardShell>
    </TooltipProvider>
  );
}
