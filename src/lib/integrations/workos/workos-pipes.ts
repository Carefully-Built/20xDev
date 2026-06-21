import { workos } from '@/lib/workos';

const GOOGLE_CALENDAR_PROVIDER = 'google-calendar';
const GMAIL_PROVIDER = 'gmail';

interface ProviderTokenArgs {
  readonly userId: string;
  readonly organizationId?: string;
}

export interface WorkOSPipesAccessTokenResult {
  readonly accessToken: string | null;
  readonly error?: string;
}

export async function getWorkOSPipesAccessToken(
  provider: string,
  args: ProviderTokenArgs,
): Promise<WorkOSPipesAccessTokenResult> {
  const result = await workos.pipes.getAccessToken({
    provider,
    userId: args.userId,
    organizationId: args.organizationId,
  });

  if (result.active) {
    return { accessToken: result.accessToken.accessToken };
  }

  return { accessToken: null, error: result.error };
}

export async function getGoogleCalendarAccessToken(
  args: ProviderTokenArgs,
): Promise<WorkOSPipesAccessTokenResult> {
  return await getWorkOSPipesAccessToken(GOOGLE_CALENDAR_PROVIDER, args);
}

export async function getGmailAccessToken(
  args: ProviderTokenArgs,
): Promise<WorkOSPipesAccessTokenResult> {
  return await getWorkOSPipesAccessToken(GMAIL_PROVIDER, args);
}
