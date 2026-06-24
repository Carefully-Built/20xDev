'use client';

import {
  AppNavigationShell,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@carefully-built/saas-kit/app-shell';
import { TooltipProvider } from '@carefully-built/saas-kit';
import type { WorkOSOrganization } from '@carefully-built/saas-kit/workos';
import { usePathname } from 'next/navigation';

import { useEffect, useRef, type ReactNode } from 'react';

import { DashboardLogo } from './dashboard-logo';
import { bottomNavItems, navItems } from './dashboard-navigation';
import { DashboardSearch } from './dashboard-search';
import { DashboardOrgSwitcher } from './dashboard-org-switcher';

// The kit's SidebarProvider always starts expanded (useState(false)) and exposes
// no initial-value prop. A fork can opt into a collapsed-by-default sidebar with
// NEXT_PUBLIC_SIDEBAR_DEFAULT_COLLAPSED=1; we apply it once on mount via the
// kit's setIsCollapsed. Env unset → no-op → 20xdev's sidebar is unchanged.
const SIDEBAR_DEFAULT_COLLAPSED = process.env.NEXT_PUBLIC_SIDEBAR_DEFAULT_COLLAPSED === '1';

function SidebarDefaultCollapse(): null {
  const { setIsCollapsed } = useSidebar();
  const applied = useRef(false);

  useEffect(() => {
    if (SIDEBAR_DEFAULT_COLLAPSED && !applied.current) {
      applied.current = true;
      setIsCollapsed(true);
    }
  }, [setIsCollapsed]);

  return null;
}

function DashboardDocumentMode(): null {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.dashboard = 'true';

    return () => {
      delete root.dataset.dashboard;
    };
  }, []);

  return null;
}

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
        <DashboardDocumentMode />
        <SidebarDefaultCollapse />
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
