'use server';

import { syncAuthenticatedUser } from '@/lib/convex-user-sync';
import { createSession } from '@/lib/session';
import { WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI, workos } from '@/lib/workos';

export async function getGoogleAuthUrl(): Promise<string> {
  return await Promise.resolve(workos.userManagement.getAuthorizationUrl({
    clientId: WORKOS_CLIENT_ID,
    provider: 'GoogleOAuth',
    redirectUri: WORKOS_REDIRECT_URI,
    state: '/dashboard',
  }));
}

export async function signUp(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await workos.userManagement.createUser({
      email,
      password,
      emailVerified: true,
    });

    const { user: authenticatedUser, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithPassword({
        clientId: WORKOS_CLIENT_ID,
        email,
        password,
    });

    await syncAuthenticatedUser(authenticatedUser);
    await createSession({ accessToken, refreshToken, user: authenticatedUser });

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account',
    };
  }
}

export async function signIn(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { user, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithPassword({
        clientId: WORKOS_CLIENT_ID,
        email,
        password,
      });

    await syncAuthenticatedUser(user);
    await createSession({ accessToken, refreshToken, user });

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid email or password',
    };
  }
}

export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await workos.userManagement.createPasswordReset({
      email,
    });

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send reset email',
    };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await workos.userManagement.resetPassword({
      token,
      newPassword,
    });

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset password',
    };
  }
}
