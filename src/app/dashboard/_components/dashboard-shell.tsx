'use client';

import { cn } from '@/lib/utils';
import { OrganizationProvider, UserProvider } from '@/providers';
import { AppSidebar, SidebarProvider, useSidebar } from './app-sidebar';
import { FeaturebaseWidget } from '@/components/featurebase/featurebase-widget';
import { useSyncUser, type WorkOSUser } from '@/hooks/use-sync-user';

import type { UserData } from '@/providers';

interface MainContentProps {
  readonly children: React.ReactNode;
}

function MainContent({ children }: MainContentProps): React.ReactElement {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      className={cn(
        "min-h-screen transition-all duration-200 ease-in-out",
        "md:pl-14",
        !isCollapsed && "md:pl-[220px]",
        "pt-16 md:pt-0"
      )}
    >
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </main>
  );
}

interface DashboardShellProps {
  readonly children: React.ReactNode;
  readonly user: WorkOSUser & UserData;
}

export function DashboardShell({ children, user }: DashboardShellProps): React.ReactElement {
  useSyncUser(user);

  const userData: UserData = {
    id: user.id,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    organizationId: user.organizationId,
  };

  return (
    <UserProvider initialUser={userData}>
      <OrganizationProvider initialOrganizationId={user.organizationId}>
        <SidebarProvider>
          <div className="min-h-screen">
            <AppSidebar />
            <MainContent>{children}</MainContent>
            <FeaturebaseWidget
              email={userData.email}
              name={userData.name}
              userId={userData.id}
              profilePicture={userData.imageUrl}
            />
          </div>
        </SidebarProvider>
      </OrganizationProvider>
    </UserProvider>
  );
}
