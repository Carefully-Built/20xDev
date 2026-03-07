export interface IntercomSettings {
  app_id: string;
  name?: string;
  email?: string;
  user_id?: string;
  created_at?: number;
  alignment?: 'left' | 'right';
  horizontal_padding?: number;
  vertical_padding?: number;
  background_color?: string;
  action_color?: string;
}

declare global {
  interface Window {
    Intercom?: (...args: unknown[]) => void;
    intercomSettings?: IntercomSettings;
  }
}

/** Returns NEXT_PUBLIC_INTERCOM_APP_ID or undefined if not set */
export function getIntercomAppId(): string | undefined {
  // eslint-disable-next-line @typescript-eslint/dot-notation -- env vars require bracket notation
  return process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] ?? undefined;
}

/** Injects the Intercom CDN script tag (async, idempotent) */
export function loadIntercomScript(appId: string): void {
  if (typeof window === 'undefined') return;
  if (document.getElementById('intercom-script')) return;

  const script = document.createElement('script');
  script.id = 'intercom-script';
  script.async = true;
  script.src = `https://widget.intercom.io/widget/${appId}`;
  document.head.appendChild(script);

  // Initialize the Intercom command queue if not already present
  if (!window.Intercom) {
    const queue: unknown[][] = [];
    window.Intercom = (...args: unknown[]) => {
      queue.push(args);
    };
  }
}

/** Calls Intercom('boot') with app_id and optional settings */
export function bootIntercom(
  settings?: Partial<Omit<IntercomSettings, 'app_id'>>,
): void {
  const appId = getIntercomAppId();
  if (typeof window === 'undefined' || !appId || !window.Intercom) return;

  window.Intercom('boot', {
    app_id: appId,
    alignment: 'right',
    horizontal_padding: 20,
    vertical_padding: 20,
    ...settings,
  });
}

/** Calls Intercom('update') with partial settings */
export function updateIntercom(
  settings: Partial<Omit<IntercomSettings, 'app_id'>>,
): void {
  if (typeof window === 'undefined' || !window.Intercom) return;
  window.Intercom('update', settings);
}

/** Calls Intercom('shutdown') to end session and remove widget */
export function shutdownIntercom(): void {
  if (typeof window === 'undefined' || !window.Intercom) return;
  window.Intercom('shutdown');
}
