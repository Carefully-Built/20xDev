'use client';

import { CreateOrganization, SidebarOrgSwitcherBase, type WorkOSOrganization } from '@carefully-built/saas-kit/workos';

import { fetchOrganizations, switchOrganization } from '@/lib/organization-api-client';
import { createOrganizationLabels } from '@/lib/toolkit-labels';
import { useOrganization } from '@/providers';

interface DashboardOrgSwitcherProps {
  readonly canAccessSuperAdmin?: boolean;
  readonly collapsed?: boolean;
  readonly initialOrganizationId?: string | null;
  readonly initialOrganizations?: readonly WorkOSOrganization[];
  readonly mobileSheet?: boolean;
}

function renderCreateOrganization({
  children,
  onCreated,
}: {
  readonly children: React.ReactNode;
  readonly onCreated: (organizationId: string) => void;
}): React.ReactElement {
  return (
    <CreateOrganization labels={createOrganizationLabels} onCreated={onCreated}>
      {children}
    </CreateOrganization>
  );
}

export function DashboardOrgSwitcher({
  canAccessSuperAdmin = false,
  collapsed,
  initialOrganizationId,
  initialOrganizations,
  mobileSheet,
}: DashboardOrgSwitcherProps): React.ReactElement {
  const { organizationId, setOrganizationId } = useOrganization();

  return (
    <SidebarOrgSwitcherBase
      canAccessSuperAdmin={canAccessSuperAdmin}
      collapsed={collapsed}
      createOrganization={renderCreateOrganization}
      currentOrganizationId={organizationId}
      dashboardHref="/dashboard"
      fetchOrganizations={fetchOrganizations}
      initialOrganizationId={initialOrganizationId}
      initialOrganizations={initialOrganizations}
      mobileSheet={mobileSheet}
      onContextOrganizationChange={setOrganizationId}
      switchOrganization={switchOrganization}
      superAdminHref="/super-admin"
    />
  );
}
