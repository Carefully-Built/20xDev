'use client';

import {
  CreateOrganization,
  SidebarOrgSwitcherBase,
  type WorkOSOrganization,
} from '@carefully-built/workos';

import { fetchOrganizations, switchOrganization } from '@/lib/organization-api-client';
import { useOrganization } from '@/providers';

interface DashboardOrgSwitcherProps {
  readonly collapsed?: boolean;
  readonly initialOrganizationId?: string | null;
  readonly initialOrganizations?: readonly WorkOSOrganization[];
  readonly mobileSheet?: boolean;
}

export function DashboardOrgSwitcher({
  collapsed,
  initialOrganizationId,
  initialOrganizations,
  mobileSheet,
}: DashboardOrgSwitcherProps): React.ReactElement {
  const { organizationId, setOrganizationId } = useOrganization();

  return (
    <SidebarOrgSwitcherBase
      collapsed={collapsed}
      createOrganization={({ children, onCreated }) => (
        <CreateOrganization onCreated={onCreated}>{children}</CreateOrganization>
      )}
      currentOrganizationId={organizationId}
      dashboardHref="/dashboard"
      fetchOrganizations={fetchOrganizations}
      initialOrganizationId={initialOrganizationId}
      initialOrganizations={initialOrganizations}
      mobileSheet={mobileSheet}
      onContextOrganizationChange={setOrganizationId}
      switchOrganization={switchOrganization}
    />
  );
}
