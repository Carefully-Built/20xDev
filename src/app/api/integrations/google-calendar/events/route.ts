import { getSession } from '@/lib/session';
import { createGoogleCalendarEventsGetHandler } from '@/lib/integrations/google/google-calendar-routes';
import { getGoogleCalendarAccessToken } from '@/lib/integrations/workos/workos-pipes';

export const GET = createGoogleCalendarEventsGetHandler({
  getAccessToken: getGoogleCalendarAccessToken,
  getSession,
});
