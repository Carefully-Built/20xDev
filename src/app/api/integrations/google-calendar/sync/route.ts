import {
  createGoogleCalendarSyncDeleteHandler,
  createGoogleCalendarSyncPostHandler,
} from '@/lib/integrations/google/google-calendar-routes';
import { getGoogleCalendarAccessToken } from '@/lib/integrations/workos/workos-pipes';
import { getSession } from '@/lib/session';

const routeOptions = {
  getAccessToken: getGoogleCalendarAccessToken,
  getSession,
};

export const DELETE = createGoogleCalendarSyncDeleteHandler(routeOptions);
export const POST = createGoogleCalendarSyncPostHandler(routeOptions);
