import { Building2, Palette, User } from 'lucide-react';
import { redirect } from 'next/navigation';

import { AccountSection } from './_components/account-section';
import { AppearanceSection } from './_components/appearance-section';
import { OrganizationSection } from './_components/organization-section';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActiveOrganizationId, listUserOrganizations } from '@/lib/organization-memberships';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

async function getWidgetToken(userId: string, organizationId: string): Promise<string | null> {
  try {
    const token = await workos.widgets.getToken({
      userId,
      organizationId,
      scopes: ['widgets:users-table:manage'],
    });
    return token;
  } catch (err) {
    console.error('Error getting widget token:', err);
    return null;
  }
}

// Token fetching is now handled client-side via /api/auth/token

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const organizations = await listUserOrganizations(session.user.id).catch((error: unknown) => {
    console.error('Error getting user org:', error);
    return [];
  });
  const organizationId = getActiveOrganizationId(organizations, session.organizationId);
  const organization = organizationId
    ? organizations.find((item) => item.id === organizationId) ?? null
    : null;
  
  // Get widget token for team management
  let teamAuthToken: string | null = null;
  if (organization) {
    teamAuthToken = await getWidgetToken(session.user.id, organization.id);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account" className="gap-1.5">
            <User className="size-3.5" />
            Account
          </TabsTrigger>
          {organization && (
            <TabsTrigger value="organization" className="gap-1.5">
              <Building2 className="size-3.5" />
              Organization
            </TabsTrigger>
          )}
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="size-3.5" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <AccountSection />
        </TabsContent>

        {organization && (
          <TabsContent value="organization" className="mt-6">
            <OrganizationSection 
              organization={organization} 
              teamAuthToken={teamAuthToken}
            />
          </TabsContent>
        )}

        <TabsContent value="appearance" className="mt-6">
          <AppearanceSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
