import { NextResponse } from 'next/server';

import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  listGoogleCalendarEvents,
} from './google-calendar';

import type { NextRequest } from 'next/server';

interface GoogleCalendarRouteSession {
  readonly user?: {
    readonly id: string;
  } | null;
  readonly organizationId?: string;
}

interface GoogleCalendarAccessTokenResult {
  readonly accessToken: string | null;
  readonly error?: string;
}

interface GoogleCalendarRouteOptions {
  readonly getSession: () => Promise<GoogleCalendarRouteSession | null | undefined>;
  readonly getAccessToken: (args: {
    readonly userId: string;
    readonly organizationId?: string;
  }) => Promise<GoogleCalendarAccessTokenResult>;
}

async function getAuthorizedGoogleCalendarToken(
  options: GoogleCalendarRouteOptions,
): Promise<
  | {
      token: GoogleCalendarAccessTokenResult;
    }
  | {
      response: NextResponse;
    }
> {
  const session = await options.getSession();

  if (!session?.user) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return {
    token: await options.getAccessToken({
      organizationId: session.organizationId,
      userId: session.user.id,
    }),
  };
}

export function createGoogleCalendarEventsGetHandler(options: GoogleCalendarRouteOptions) {
  return async function GET(request: NextRequest): Promise<NextResponse> {
    try {
      const start = request.nextUrl.searchParams.get('start');
      const end = request.nextUrl.searchParams.get('end');

      if (!start || !end) {
        return NextResponse.json({ error: 'Missing date range' }, { status: 400 });
      }

      const result = await getAuthorizedGoogleCalendarToken(options);
      if ('response' in result) {
        return result.response;
      }

      if (!result.token.accessToken) {
        return NextResponse.json({
          connectionError: result.token.error ?? 'not_installed',
          events: [],
        });
      }

      const events = await listGoogleCalendarEvents({
        accessToken: result.token.accessToken,
        end,
        start,
      });

      return NextResponse.json({ events });
    } catch (error) {
      console.error('Failed to fetch Google Calendar events:', error);
      return NextResponse.json({ error: 'Failed to fetch Google Calendar events' }, { status: 500 });
    }
  };
}

function parseSyncEventPayload(payload: Record<string, unknown>) {
  if (
    typeof payload.title !== 'string' ||
    !payload.title.trim() ||
    typeof payload.startAt !== 'number' ||
    typeof payload.timeZone !== 'string' ||
    !payload.timeZone.trim() ||
    typeof payload.allDay !== 'boolean'
  ) {
    throw new Error('Invalid Google Calendar event payload');
  }

  return {
    allDay: payload.allDay,
    description: typeof payload.description === 'string' ? payload.description.trim() : undefined,
    endAt: typeof payload.endAt === 'number' ? payload.endAt : undefined,
    startAt: payload.startAt,
    timeZone: payload.timeZone.trim(),
    title: payload.title.trim(),
  };
}

export function createGoogleCalendarSyncPostHandler(options: GoogleCalendarRouteOptions) {
  return async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const result = await getAuthorizedGoogleCalendarToken(options);
      if ('response' in result) {
        return result.response;
      }

      if (!result.token.accessToken) {
        return NextResponse.json({ error: result.token.error ?? 'not_installed' }, { status: 409 });
      }

      const payload = parseSyncEventPayload((await request.json()) as Record<string, unknown>);
      const event = await createGoogleCalendarEvent({
        accessToken: result.token.accessToken,
        ...payload,
      });

      return NextResponse.json({ eventId: event.id ?? null });
    } catch (error) {
      console.error('Failed to sync Google Calendar event:', error);
      return NextResponse.json({ error: 'Failed to sync Google Calendar event' }, { status: 500 });
    }
  };
}

export function createGoogleCalendarSyncDeleteHandler(options: GoogleCalendarRouteOptions) {
  return async function DELETE(request: NextRequest): Promise<NextResponse> {
    try {
      const result = await getAuthorizedGoogleCalendarToken(options);
      if ('response' in result) {
        return result.response;
      }

      if (!result.token.accessToken) {
        return NextResponse.json({ error: result.token.error ?? 'not_installed' }, { status: 409 });
      }

      const payload = (await request.json()) as { eventId?: unknown };
      if (typeof payload.eventId !== 'string' || !payload.eventId.trim()) {
        return NextResponse.json({ error: 'Invalid Google Calendar delete payload' }, { status: 400 });
      }

      await deleteGoogleCalendarEvent({
        accessToken: result.token.accessToken,
        eventId: payload.eventId.trim(),
      });

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error);
      return NextResponse.json({ error: 'Failed to delete Google Calendar event' }, { status: 500 });
    }
  };
}
