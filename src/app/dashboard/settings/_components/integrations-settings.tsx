'use client';

import { Pipes, WorkOsWidgets } from '@workos-inc/widgets';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { SettingsSectionCard } from '@carefully-built/settings-ui';
import { SettingsPipesWidgetPanel, SettingsSwitchRow } from '@carefully-built/settings-ui/client';

import { useCurrentUserByOrganization, useUpdateIntegrationPreferences } from '@/hooks/use-users';
import {
  resolveGoogleCalendarPreferences,
  type GoogleCalendarPreferences,
} from '@/lib/integrations/google/google-calendar';
import { useOrganization } from '@/providers';

interface WorkOsWidgetRuntimeConfig {
  readonly apiHostname?: string;
  readonly https?: boolean;
}

async function fetchPipesAuthToken(): Promise<string> {
  const response = await fetch('/api/integrations/pipes/auth-token', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to get the integrations auth token');
  }

  const data = (await response.json()) as { readonly token: string };
  return data.token;
}

function getWidgetsApiHostname(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.location.host;
}

function getWidgetsApiUsesHttps(): boolean | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.location.protocol === 'https:';
}

export function IntegrationsSettings(): React.ReactElement {
  const { organizationId } = useOrganization();
  const currentUser = useCurrentUserByOrganization(organizationId);
  const updateIntegrationPreferences = useUpdateIntegrationPreferences();
  const [pipesAuthToken, setPipesAuthToken] = useState<string>();
  const [pipesAuthTokenError, setPipesAuthTokenError] = useState(false);
  const [savingKey, setSavingKey] = useState<keyof GoogleCalendarPreferences | null>(null);
  const [widgetsRuntimeConfig, setWidgetsRuntimeConfig] = useState<WorkOsWidgetRuntimeConfig>({});
  const preferences = useMemo(
    () => resolveGoogleCalendarPreferences(currentUser?.integrationPreferences),
    [currentUser?.integrationPreferences],
  );
  const arePreferencesDisabled = !organizationId || !currentUser?._id || savingKey !== null;

  useEffect(() => {
    setWidgetsRuntimeConfig({
      apiHostname: getWidgetsApiHostname(),
      https: getWidgetsApiUsesHttps(),
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPipesAuthToken(): Promise<void> {
      try {
        const token = await fetchPipesAuthToken();

        if (isMounted) {
          setPipesAuthToken(token);
          setPipesAuthTokenError(false);
        }
      } catch (error) {
        console.error('Failed to load integrations auth token:', error);

        if (isMounted) {
          setPipesAuthTokenError(true);
        }
      }
    }

    void loadPipesAuthToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePreferenceChange = useCallback(
    async (key: keyof GoogleCalendarPreferences, checked: boolean): Promise<void> => {
      if (!organizationId || !currentUser?._id) {
        toast.error('No active organization for these integration settings.');
        return;
      }

      setSavingKey(key);

      try {
        await updateIntegrationPreferences({
          id: currentUser._id,
          integrationPreferences: {
            ...(currentUser.integrationPreferences ?? {}),
            googleCalendar: {
              ...preferences,
              [key]: checked,
            },
          },
          organizationId,
        });
      } catch (error) {
        console.error('Failed to update Google Calendar preferences:', error);
        toast.error('Unable to save Google Calendar settings.');
      } finally {
        setSavingKey(null);
      }
    },
    [currentUser, organizationId, preferences, updateIntegrationPreferences],
  );

  return (
    <WorkOsWidgets
      apiHostname={widgetsRuntimeConfig.apiHostname}
      https={widgetsRuntimeConfig.https}
      theme={{ accentColor: 'teal', radius: 'medium' }}
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-muted-foreground text-sm">
            Connect the external services used by this workspace.
          </p>
        </div>

        <div className="space-y-4">
          <SettingsSectionCard
            title="Gmail"
            subtitle="Connect the mailbox used for inbox-driven automations."
            contentClassName="space-y-4"
          >
            <SettingsPipesWidgetPanel
              authToken={pipesAuthToken}
              className="workos-widget-container gmail-pipes-widget"
              errorText="Unable to load integrations."
              hasError={pipesAuthTokenError}
              loadingText="Loading Gmail connection..."
              renderWidget={(authToken) => <Pipes authToken={authToken} />}
            />
          </SettingsSectionCard>

          <SettingsSectionCard
            title="Google Calendar"
            subtitle="Connect your calendar and choose how dashboard events sync."
            contentClassName="space-y-6"
          >
            <SettingsPipesWidgetPanel
              authToken={pipesAuthToken}
              className="workos-widget-container google-calendar-pipes-widget"
              errorText="Unable to load integrations."
              hasError={pipesAuthTokenError}
              loadingText="Loading Google Calendar connection..."
              renderWidget={(authToken) => <Pipes authToken={authToken} />}
            />

            <div className="space-y-4">
              <SettingsSwitchRow
                checked={preferences.showExistingEvents}
                description="Show existing Google Calendar events inside the dashboard calendar."
                disabled={arePreferencesDisabled}
                id="google-calendar-show-existing"
                label="Show existing Google Calendar events"
                onCheckedChange={(checked) => {
                  void handlePreferenceChange('showExistingEvents', checked);
                }}
              />
              <SettingsSwitchRow
                checked={preferences.syncDashboardEvents}
                description="Create a Google Calendar event when a dashboard activity is created."
                disabled={arePreferencesDisabled}
                id="google-calendar-sync-dashboard-events"
                label="Sync new dashboard events to Google Calendar"
                onCheckedChange={(checked) => {
                  void handlePreferenceChange('syncDashboardEvents', checked);
                }}
              />
            </div>
          </SettingsSectionCard>
        </div>
      </div>
    </WorkOsWidgets>
  );
}
