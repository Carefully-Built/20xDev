import { DashboardPageLayout } from '@carefully-built/app-shell';
import { SettingsTabs } from '@carefully-built/settings-ui/client';
import { Building2, Link2, Settings2, User } from 'lucide-react';
import { redirect } from 'next/navigation';

import { IntegrationsSettings } from './_components/integrations-settings';
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
  const tabs = [
    {
      content: <ThemeSettings />,
      icon: <Settings2 className="size-3.5" />,
      label: 'General',
      value: 'general',
    },
    ...(organization
      ? [
          {
            content: (
              <WorkOSOrganizationSettings
                organization={organization}
                teamAuthToken={teamAuthToken}
              />
            ),
            icon: <Building2 className="size-3.5" />,
            label: 'Organization',
            value: 'organization',
          },
        ]
      : []),
    {
      content: <IntegrationsSettings />,
      icon: <Link2 className="size-3.5" />,
      label: 'Integrations',
      value: 'integrations',
    },
    {
      content: <WorkOSSettings />,
      icon: <User className="size-3.5" />,
      label: 'Account',
      value: 'account',
    },
  ];

  return (
    <DashboardPageLayout fillViewport={false} title="Settings">
      <SettingsTabs initialTab="general" tabs={tabs} />
    </DashboardPageLayout>
  );
}
