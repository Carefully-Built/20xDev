import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import {
  clearPendingOrganizationSelection,
  createPendingOrganizationSelection,
  createSession,
} from '@/lib/session';
import { WORKOS_CLIENT_ID, workos } from '@/lib/workos';

function getSafeRedirectPath(raw: string | null): string {
  if (!raw?.startsWith('/')) {
    return '/dashboard';
  }

  if (raw.startsWith('//')) {
    return '/dashboard';
  }

  return raw;
}

interface OrganizationSelectionErrorData {
  code?: string;
  error?: string;
  error_description?: string;
  message?: string;
  organizations?: {
    id?: string;
    name?: string;
    organization?: {
      id?: string;
      name?: string;
    };
    organizationId?: string;
    organizationName?: string;
  }[];
  organizationSelections?: {
    id?: string;
    name?: string;
    organization?: {
      id?: string;
      name?: string;
    };
  }[];
  organization_selections?: {
    id?: string;
    name?: string;
    organization?: {
      id?: string;
      name?: string;
    };
  }[];
  pending_authentication_token?: string;
  pendingAuthenticationToken?: string;
}

interface OrganizationOption {
  id: string;
  name: string;
}

function normalizeOrganizations(rawOrganizations: unknown): OrganizationOption[] {
  if (!Array.isArray(rawOrganizations)) {
    return [];
  }

  return rawOrganizations
    .map((raw) => {
      if (!raw || typeof raw !== 'object') {
        return null;
      }

      const item = raw as {
        id?: string;
        name?: string;
        organization?: { id?: string; name?: string };
        organizationId?: string;
        organizationName?: string;
      };

      const id = item.id ?? item.organizationId ?? item.organization?.id;
      const name = item.name ?? item.organizationName ?? item.organization?.name;

      if (!id || !name) {
        return null;
      }

      return { id, name };
    })
    .filter((organization): organization is OrganizationOption => organization !== null);
}

function extractOrganizationSelectionError(error: unknown): {
  organizations: OrganizationOption[];
  pendingAuthenticationToken: string;
} | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const enrichedError = error as Error & {
    rawData?: OrganizationSelectionErrorData;
  };
  const rawData = enrichedError.rawData ?? {};
  const errorCode = rawData.code ?? rawData.error;
  const errorMessage = rawData.error_description ?? rawData.message ?? error.message;
  const requiresSelection =
    errorCode === 'organization_selection_required'
    || errorMessage.toLowerCase().includes('choose an organization');

  if (!requiresSelection) {
    return null;
  }

  const pendingAuthenticationToken =
    rawData.pending_authentication_token ?? rawData.pendingAuthenticationToken;

  if (!pendingAuthenticationToken) {
    return null;
  }

  return {
    organizations: [
      ...normalizeOrganizations(rawData.organizations),
      ...normalizeOrganizations(rawData.organizationSelections),
      ...normalizeOrganizations(rawData.organization_selections),
    ],
    pendingAuthenticationToken,
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  const state = request.nextUrl.searchParams.get('state');

  try {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
    }

    const { accessToken, refreshToken, user, organizationId } =
      await workos.userManagement.authenticateWithCode({
        clientId: WORKOS_CLIENT_ID,
        code,
      });

    if (!accessToken || !refreshToken) {
      throw new Error('Google auth response is missing tokens');
    }

    await createSession({
      accessToken,
      refreshToken,
      user,
      organizationId,
    });
    await clearPendingOrganizationSelection();

    await syncAuthenticatedUser(user, organizationId);

    return NextResponse.redirect(new URL(getSafeRedirectPath(state), request.url));
  } catch (error) {
    const selectionData = extractOrganizationSelectionError(error);

    if (selectionData) {
      await createPendingOrganizationSelection({
        organizations: selectionData.organizations,
        pendingAuthenticationToken: selectionData.pendingAuthenticationToken,
        redirectPath: getSafeRedirectPath(state),
      });

      return NextResponse.redirect(new URL('/login/select-organization', request.url));
    }

    console.error('Auth callback failed:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_callback_failed', request.url));
  }
}
