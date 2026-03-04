'use client';

import {
  UserProfile,
  UserSecurity,
  WorkOsWidgets,
} from '@workos-inc/widgets';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Fetches a fresh widget token from the server (1-hour expiry)
 */
async function fetchWidgetToken(): Promise<string> {
  const response = await fetch('/api/auth/token');
  if (!response.ok) {
    throw new Error('Failed to fetch widget token');
  }
  const data = await response.json() as { token: string };
  return data.token;
}

export function AccountSection(): React.ReactElement {
  const router = useRouter();

  const handleUserUpdate = useCallback((): void => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    globalThis.addEventListener('user-updated', handleUserUpdate);
    return (): void => {
      globalThis.removeEventListener('user-updated', handleUserUpdate);
    };
  }, [handleUserUpdate]);

  return (
    <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="workos-widget-container">
            <UserProfile authToken={fetchWidgetToken} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and two-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="workos-widget-container">
            <UserSecurity authToken={fetchWidgetToken} />
          </CardContent>
        </Card>
      </div>
    </WorkOsWidgets>
  );
}
