import type { NextResponse } from 'next/server';

import { createWorkOSWidgetTokenResponse } from '@/lib/integrations/workos/workos-widget-token-route';

export async function GET(): Promise<NextResponse> {
  return await createWorkOSWidgetTokenResponse({
    errorMessage: 'Unable to get the Pipes widget token',
    logContext: 'generate Pipes widget token',
  });
}
