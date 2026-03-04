import { Building2, Globe, Palette, User } from 'lucide-react';
import { redirect } from 'next/navigation';

import { AccountSection } from './_components/account-section';
import { AppearanceSection } from './_components/appearance-section';
import { LanguageSection } from './_components/language-section';
import { OrganizationSection } from './_components/organization-section';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface OrgInfo {
  id: string;
  name: string;
  role: string;
}

async function getOrganization(userId: string, sessionOrgId?: string): Promise<OrgInfo | null> {
  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId,
    });

    if (memberships.data.length === 0) {
      return null;
    }

    const targetMembership = sessionOrgId
      ? memberships.data.find((m) => m.organizationId === sessionOrgId)
      : memberships.data[0];

    const membership = targetMembership ?? memberships.data[0];
    if (!membership) {
      return null;
    }

    const org = await workos.organizations.getOrganization(membership.organizationId);

    return {
      id: org.id,
      name: org.name,
      role: membership.role.slug || 'member',
    };
  } catch (err) {
    console.error('Error getting user org:', err);
    return null;
  }
}

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

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const organization = await getOrganization(session.user.id, session.organizationId);
  
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
          <TabsTrigger value="language" className="gap-1.5">
            <Globe className="size-3.5" />
            Language
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

        <TabsContent value="language" className="mt-6">
          <LanguageSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
