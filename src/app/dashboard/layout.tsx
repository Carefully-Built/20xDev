import { redirect } from 'next/navigation';

import { DashboardShell } from './_components/dashboard-shell';
import { NoOrgView } from './_components/no-org-view';

import { TooltipProvider } from '@/components/ui/tooltip';
import { syncUserOrganizationToConvex } from '@/lib/convex-server';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';


interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  let hasOrganization = false;
  let organizationId: string | undefined;
  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });
    hasOrganization = memberships.data.length > 0;
    
    // Use session org if available and user has access, otherwise first membership
    if (session.organizationId && memberships.data.some((m) => m.organizationId === session.organizationId)) {
      organizationId = session.organizationId;
    } else {
      organizationId = memberships.data[0]?.organizationId;
    }
  } catch (error) {
    console.error('Error checking organization:', error);
  }

  if (!hasOrganization) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <NoOrgView />
      </div>
    );
  }

  await syncUserOrganizationToConvex(session.user.id, organizationId);

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
