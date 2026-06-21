import { DashboardPageLayout } from '@carefully-built/app-shell';
import { SettingsTabs } from '@carefully-built/settings-ui/client';
import { redirect } from 'next/navigation';

import { ThemeSettings } from './_components/theme-settings';
import { WorkOSOrganizationSettings, WorkOSSettings } from './_components/workos-settings';

import { getActiveOrganizationId, listUserOrganizations } from '@/lib/organization-memberships';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export const dynamic = 'force-dynamic';

async function getTeamWidgetToken(
  userId: string,
  organizationId: string | null,
): Promise<string | null> {
  if (!organizationId) {
    return null;
  }

  try {
    return await workos.widgets.getToken({
      organizationId,
      scopes: ['widgets:users-table:manage'],
      userId,
    });
  } catch (error) {
    console.error('Error loading WorkOS team widget token:', error);
    return null;
  }
}

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const organizations = await listUserOrganizations(session.user.id);
  const organizationId = getActiveOrganizationId(organizations, session.organizationId);
  const organization = organizations.find((item) => item.id === organizationId) ?? null;
  const teamAuthToken = await getTeamWidgetToken(session.user.id, organizationId);

  return (
    <DashboardPageLayout fillViewport={false} title="Settings">
      <SettingsTabs
        hasOrganization={Boolean(organization)}
        initialTab="general"
        generalContent={<ThemeSettings />}
        accountContent={<WorkOSSettings />}
        organizationContent={
          <WorkOSOrganizationSettings organization={organization} teamAuthToken={teamAuthToken} />
        }
      />
    </DashboardPageLayout>
  );
}
