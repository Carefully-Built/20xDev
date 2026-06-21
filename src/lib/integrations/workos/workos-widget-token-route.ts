import {
  createWorkOSWidgetTokenResponse as createWorkOSWidgetTokenResponseFromKit,
  getWorkOSWidgetToken as getWorkOSWidgetTokenFromKit,
} from '@carefully-built/workos/server';

import type { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface WidgetTokenSession {
  readonly user?: {
    readonly id: string;
  } | null;
  readonly organizationId?: string | null;
}

interface WidgetTokenArgs {
  readonly userId: string;
  readonly organizationId: string;
}

interface WorkOSWidgetTokenOptions {
  readonly logContext: string;
  readonly errorMessage: string;
  readonly getSession?: () => Promise<WidgetTokenSession | null | undefined>;
  readonly getToken?: (args: WidgetTokenArgs) => Promise<string>;
}

type WorkOSWidgetTokenResult =
  | {
      readonly token: string;
    }
  | {
      readonly response: NextResponse;
    };

export async function getWorkOSWidgetToken({
  logContext,
  errorMessage,
  getSession: resolveSession = getSession,
  getToken = (args) => workos.widgets.getToken(args),
}: WorkOSWidgetTokenOptions): Promise<WorkOSWidgetTokenResult> {
  return await getWorkOSWidgetTokenFromKit({
    errorMessage,
    getSession: resolveSession,
    getToken,
    logContext,
  });
}

export async function createWorkOSWidgetTokenResponse(
  options: WorkOSWidgetTokenOptions,
): Promise<NextResponse> {
  return await createWorkOSWidgetTokenResponseFromKit({
    getSession,
    getToken: (args) => workos.widgets.getToken(args),
    ...options,
  });
}
