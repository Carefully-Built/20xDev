'use client';

import { uploadOrganizationLogo } from '@carefully-built/workos';
import { OrganizationProfileSettings } from '@carefully-built/workos/organization-profile-settings';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@carefully-built/ui';
import { UserProfile, UserSecurity, UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import { useMutation, useQuery } from 'convex/react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { signOutAction } from '@/app/(auth)/actions';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';

interface OrganizationInfo {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

interface AccountWidgetsProps {
  readonly organization: OrganizationInfo | null;
}

async function fetchWidgetToken(): Promise<string> {
  const response = await fetch('/api/auth/token', { cache: 'no-store' });

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

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={signOutAction}>
              <Button type="submit" variant="destructive">
                <LogOut className="size-4" />
                Log out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </WorkOsWidgets>
  );
}

export function WorkOSOrganizationSettings({ organization }: AccountWidgetsProps): React.ReactElement {
  const router = useRouter();
  const orgData = useQuery(
    api.functions.organizations.queries.getByWorkosId,
    organization ? { workosId: organization.id } : 'skip',
  );
  const generateUploadUrl = useMutation(api.functions.organizations.mutations.generateUploadUrl);
  const saveLogo = useMutation(api.functions.organizations.mutations.saveLogo);
  const deleteLogo = useMutation(api.functions.organizations.mutations.deleteLogo);
  const canEditOrganization = Boolean(
    organization && ['admin', 'owner'].some((role) => organization.role.toLowerCase().includes(role)),
  );

  const handleOrganizationSave = async ({
    logoFile,
    name,
    removeLogo,
  }: {
    readonly logoFile: File | null;
    readonly name: string;
    readonly removeLogo: boolean;
  }): Promise<void> => {
    if (!organization) {
      throw new Error('No active organization');
    }

    if (logoFile) {
      await uploadOrganizationLogo({
        file: logoFile,
        generateUploadUrl,
        saveLogo: (payload) =>
          saveLogo({
            workosId: payload.workosId,
            storageId: payload.storageId as Id<'_storage'>,
          }),
        workosId: organization.id,
      });
    } else if (removeLogo && orgData?.logoUrl) {
      await deleteLogo({ workosId: organization.id });
    }

    if (name !== organization.name) {
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Unable to update organization');
      }
    }
  };

  return (
    <div className="space-y-4">
      {organization ? (
        <OrganizationProfileSettings
          canEdit={canEditOrganization}
          logoUrl={orgData?.logoUrl ?? null}
          organization={organization}
          onSave={handleOrganizationSave}
          onUpdated={() => {
            globalThis.dispatchEvent(new CustomEvent('org-updated'));
            router.refresh();
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No organization is active for this session.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="workos-widget-container">
          {organization ? (
            <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
              <UsersManagement authToken={fetchWidgetToken} />
            </WorkOsWidgets>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
