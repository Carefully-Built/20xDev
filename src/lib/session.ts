import { sealData, unsealData } from 'iron-session';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

import { WORKOS_CLIENT_ID, WORKOS_COOKIE_PASSWORD, workos } from './workos';

import type { User } from '@workos-inc/node';

interface AccessToken {
  sid?: string;
  org_id?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  entitlements?: string[];
  feature_flags?: string[];
}

interface SessionData {
  accessToken: string;
  entitlements?: string[];
  featureFlags?: string[];
  organizationId?: string;
  permissions?: string[];
  refreshToken: string;
  role?: string;
  roles?: string[];
  sessionId?: string;
  user: User;
  workosClientId: string;
}

interface PendingOrganizationSelectionData {
  organizations: {
    id: string;
    name: string;
  }[];
  pendingAuthenticationToken: string;
  redirectPath: string;
}

const SESSION_COOKIE_NAME = process.env.WORKOS_COOKIE_NAME ?? 'session';
const PENDING_ORG_SELECTION_COOKIE_NAME = 'pending_org_selection';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PENDING_ORG_SELECTION_TTL_SECONDS = 60 * 10;
const SESSION_OPTIONS = {
  password: WORKOS_COOKIE_PASSWORD,
  ttl: SESSION_TTL_SECONDS,
};
const PENDING_ORG_SELECTION_OPTIONS = {
  password: WORKOS_COOKIE_PASSWORD,
  ttl: PENDING_ORG_SELECTION_TTL_SECONDS,
};

function hasWorkOSEnv(): boolean {
  return Boolean(
    process.env.WORKOS_API_KEY &&
    process.env.WORKOS_CLIENT_ID &&
    process.env.WORKOS_COOKIE_PASSWORD &&
    process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
  );
}

function attachAccessTokenClaims(session: SessionData): SessionData {
  const claims = decodeJwt<AccessToken>(session.accessToken);

  return {
    ...session,
    entitlements: claims.entitlements,
    featureFlags: claims.feature_flags,
    organizationId: session.organizationId ?? claims.org_id,
    permissions: claims.permissions,
    role: claims.role,
    roles: claims.roles,
    sessionId: claims.sid,
  };
}

export async function createSession(
  data: Omit<SessionData, 'workosClientId'> & Partial<Pick<SessionData, 'workosClientId'>>,
): Promise<void> {
  if (!hasWorkOSEnv()) {
    throw new Error('WorkOS env incomplete');
  }

  const cookieStore = await cookies();
  const encryptedSession = await sealData(
    {
      ...data,
      workosClientId: data.workosClientId ?? WORKOS_CLIENT_ID,
    } satisfies SessionData,
    SESSION_OPTIONS,
  );

  cookieStore.set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getSession(): Promise<SessionData | null> {
  if (!hasWorkOSEnv()) {
    console.warn('WorkOS env incomplete - returning null session');
    return null;
  }

  try {
    const cookieStore = await cookies();
    const encryptedSession = cookieStore.get(SESSION_COOKIE_NAME);

    if (!encryptedSession?.value) {
      return null;
    }

    const session = await unsealData<SessionData>(encryptedSession.value, SESSION_OPTIONS);

    if (session.workosClientId !== WORKOS_CLIENT_ID) {
      return null;
    }

    return attachAccessTokenClaims(session);
  } catch (error) {
    console.error('Failed to resolve WorkOS session:', error);
    return null;
  }
}

export async function refreshSession(organizationId?: string): Promise<SessionData | null> {
  const session = await getSession();

  if (!session?.refreshToken) {
    return session;
  }

  const refreshed = await workos.userManagement.authenticateWithRefreshToken({
    clientId: WORKOS_CLIENT_ID,
    refreshToken: session.refreshToken,
    organizationId: organizationId ?? session.organizationId,
  });

  await createSession({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    user: refreshed.user,
    organizationId: refreshed.organizationId,
  });

  return attachAccessTokenClaims({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    user: refreshed.user,
    organizationId: refreshed.organizationId,
    workosClientId: WORKOS_CLIENT_ID,
  });
}

export async function createPendingOrganizationSelection(
  data: PendingOrganizationSelectionData,
): Promise<void> {
  if (!hasWorkOSEnv()) {
    throw new Error('WorkOS env incomplete');
  }

  const cookieStore = await cookies();
  const encrypted = await sealData(data, PENDING_ORG_SELECTION_OPTIONS);

  cookieStore.set(PENDING_ORG_SELECTION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    maxAge: PENDING_ORG_SELECTION_TTL_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getPendingOrganizationSelection(): Promise<PendingOrganizationSelectionData | null> {
  if (!hasWorkOSEnv()) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const encrypted = cookieStore.get(PENDING_ORG_SELECTION_COOKIE_NAME);

    if (!encrypted?.value) {
      return null;
    }

    return await unsealData<PendingOrganizationSelectionData>(
      encrypted.value,
      PENDING_ORG_SELECTION_OPTIONS,
    );
  } catch (error) {
    console.error('Failed to resolve pending organization selection:', error);
    return null;
  }
}

export async function clearPendingOrganizationSelection(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_ORG_SELECTION_COOKIE_NAME);
}
