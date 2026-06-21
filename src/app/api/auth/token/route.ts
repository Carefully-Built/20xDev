import { createWorkOSWidgetTokenResponse, type WidgetScopes } from '@carefully-built/saas-kit/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

/**
 * Widget scopes for Profile, Security, and Team widgets
 */
const WIDGET_SCOPES = [
  'widgets:users-table:manage',
  'widgets:api-keys:manage',
  'widgets:domain-verification:manage',
  'widgets:sso:manage',
] as const satisfies readonly WidgetScopes[];

/**
 * GET /api/auth/token
 * Returns widget token for WorkOS widgets (1 hour expiry)
 */
export async function GET(): Promise<Response> {
  return createWorkOSWidgetTokenResponse({
    errorMessage: 'Failed to get token',
    getSession,
    getToken: async ({ organizationId, userId }) =>
      workos.widgets.getToken({
        userId,
        organizationId,
        scopes: [...WIDGET_SCOPES],
      }),
    logContext: 'get widget token',
  });
}
