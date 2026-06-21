'use client';

import { UserProfile, UserSecurity, UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import { Card, CardContent, CardHeader, CardTitle } from '@carefully-built/ui';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

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

export function WorkOSSettings(): React.ReactElement {
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
      <div className="space-y-4">
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
      </div>
    </WorkOsWidgets>
  );
}

export function WorkOSOrganizationSettings({
  organization,
  teamAuthToken,
}: AccountWidgetsProps): React.ReactElement {
  return (
    <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
      <Card>
        <CardHeader>
          <CardTitle>{organization ? organization.name : 'Organization'}</CardTitle>
        </CardHeader>
        <CardContent className="workos-widget-container space-y-3">
          {organization ? (
            <p className="text-muted-foreground text-sm">Role: {organization.role}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              No organization is active for this session.
            </p>
          )}
          {teamAuthToken ? <UsersManagement authToken={teamAuthToken} /> : null}
        </CardContent>
      </Card>
    </WorkOsWidgets>
  );
}
