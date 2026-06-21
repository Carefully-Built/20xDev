'use client';

import { AppNavigationShell, SidebarInset, SidebarProvider } from '@carefully-built/saas-kit/app-shell';
import { TooltipProvider } from '@carefully-built/saas-kit';
import type { WorkOSOrganization } from '@carefully-built/saas-kit/workos';
import { usePathname } from 'next/navigation';

import type { ReactNode } from 'react';

import { DashboardLogo } from './dashboard-logo';
import { bottomNavItems, navItems } from './dashboard-navigation';
import { DashboardSearch } from './dashboard-search';
import { DashboardOrgSwitcher } from './dashboard-org-switcher';

interface DashboardShellProps {
  readonly canAccessSuperAdmin?: boolean;
  readonly children: ReactNode;
  readonly initialOrganizationId?: string | null;
  readonly initialOrganizations?: readonly WorkOSOrganization[];
}

export function DashboardShell({
  canAccessSuperAdmin = false,
  children,
  initialOrganizationId,
  initialOrganizations,
}: DashboardShellProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppNavigationShell
          currentPath={pathname}
          logo={<DashboardLogo />}
          logoHref="/dashboard"
          navItems={navItems}
          bottomNavItems={bottomNavItems}
          mobileNavigation={{
            bottom: ['overview', 'contacts', 'pipeline', 'files'],
          }}
          renderSearch={({ isCollapsed, isMobile, onNavigate, triggerVariant }) => (
            <DashboardSearch
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              onNavigate={onNavigate}
              triggerVariant={triggerVariant}
            />
          )}
          renderFooter={({ isCollapsed, isMobile }) => (
            <DashboardOrgSwitcher
              canAccessSuperAdmin={canAccessSuperAdmin}
              collapsed={isCollapsed}
              initialOrganizationId={initialOrganizationId}
              initialOrganizations={initialOrganizations}
              mobileSheet={isMobile}
            />
          )}
        />
        <SidebarInset as="main" hasMobileBottomNav contentClassName="space-y-4">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
