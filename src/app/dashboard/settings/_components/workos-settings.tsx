'use client';

import { UserProfile, UserSecurity, UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import { Card, CardContent, CardHeader, CardTitle } from '@carefully-built/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSettings } from './theme-settings';

interface OrganizationInfo {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

interface AccountWidgetsProps {
  readonly organization: OrganizationInfo | null;
  readonly teamAuthToken: string | null;
}

async function fetchWidgetToken(): Promise<string> {
  const response = await fetch('/api/auth/token');

  if (!response.ok) {
    throw new Error('Failed to fetch WorkOS widget token');
  }

  const data = (await response.json()) as { readonly token: string };
  return data.token;
}

export function WorkOSSettings({
  organization,
  teamAuthToken,
}: AccountWidgetsProps): React.ReactElement {
  const router = useRouter();
  const refreshAfterUserUpdate = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    globalThis.addEventListener('user-updated', refreshAfterUserUpdate);
    return () => {
      globalThis.removeEventListener('user-updated', refreshAfterUserUpdate);
    };
  }, [refreshAfterUserUpdate]);

  return (
    <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
      <Tabs className="space-y-4" defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="workos-widget-container">
              <UserProfile authToken={fetchWidgetToken} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="workos-widget-container">
              <UserSecurity authToken={fetchWidgetToken} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>{organization ? organization.name : 'Organization'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 workos-widget-container">
              {organization ? (
                <p className="text-sm text-muted-foreground">Role: {organization.role}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No organization is active for this session.
                </p>
              )}
              {teamAuthToken ? <UsersManagement authToken={teamAuthToken} /> : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </WorkOsWidgets>
  );
}
