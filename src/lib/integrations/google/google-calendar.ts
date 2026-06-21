const GOOGLE_CALENDAR_API_BASE_URL =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export interface GoogleCalendarPreferences {
  showExistingEvents: boolean;
  syncDashboardEvents: boolean;
}

export interface UserIntegrationPreferences {
  googleCalendar?: Partial<GoogleCalendarPreferences> | null;
}

export interface GoogleCalendarEventListItem {
  id: string;
  title: string;
  description?: string;
  startAt: number;
  endAt?: number;
  allDay: boolean;
}

const defaultGoogleCalendarPreferences: GoogleCalendarPreferences = {
  showExistingEvents: false,
  syncDashboardEvents: false,
};

function formatDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function toIsoDateInTimeZone(timestamp: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  }).formatToParts(new Date(timestamp));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    const fallbackDate = new Date(timestamp);
    return `${String(fallbackDate.getUTCFullYear())}-${formatDatePart(fallbackDate.getUTCMonth() + 1)}-${formatDatePart(fallbackDate.getUTCDate())}`;
  }

  return `${year}-${month}-${day}`;
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getNormalizedTimedEndAt(startAt: number, endAt?: number): number {
  return typeof endAt === 'number' && endAt > startAt ? endAt : startAt + 60 * 60 * 1000;
}

function parseGoogleCalendarDate(date?: { date?: string; dateTime?: string }): {
  timestamp?: number;
  allDay: boolean;
} {
  if (!date) {
    return { allDay: false };
  }

  if (date.dateTime) {
    return { allDay: false, timestamp: Date.parse(date.dateTime) };
  }

  if (date.date) {
    return { allDay: true, timestamp: Date.parse(`${date.date}T00:00:00.000Z`) };
  }

  return { allDay: false };
}

async function googleCalendarFetch<T>(
  accessToken: string,
  input: string,
  init: RequestInit,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(input, {
    ...init,
    cache: 'no-store',
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Calendar request failed (${String(response.status)}): ${body}`);
  }

  return (await response.json()) as T;
}

export function resolveGoogleCalendarPreferences(
  preferences: UserIntegrationPreferences | null | undefined,
): GoogleCalendarPreferences {
  return {
    ...defaultGoogleCalendarPreferences,
    ...preferences?.googleCalendar,
  };
}

export async function listGoogleCalendarEvents(args: {
  accessToken: string;
  start: string;
  end: string;
}): Promise<GoogleCalendarEventListItem[]> {
  const searchParams = new URLSearchParams({
    orderBy: 'startTime',
    singleEvents: 'true',
    timeMax: args.end,
    timeMin: args.start,
  });
  const payload = await googleCalendarFetch<{
    items?: {
      id?: string;
      summary?: string;
      description?: string;
      start?: { date?: string; dateTime?: string };
      end?: { date?: string; dateTime?: string };
    }[];
  }>(args.accessToken, `${GOOGLE_CALENDAR_API_BASE_URL}?${searchParams.toString()}`, {
    method: 'GET',
  });

  return (payload.items ?? []).flatMap((item) => {
    const start = parseGoogleCalendarDate(item.start);
    const end = parseGoogleCalendarDate(item.end);

    if (!item.id || !item.summary || !start.timestamp) {
      return [];
    }

    return [
      {
        allDay: start.allDay,
        description: item.description,
        endAt: end.timestamp,
        id: item.id,
        startAt: start.timestamp,
        title: item.summary,
      },
    ];
  });
}

export async function createGoogleCalendarEvent(args: {
  accessToken: string;
  title: string;
  description?: string;
  startAt: number;
  endAt?: number;
  timeZone: string;
  allDay: boolean;
}): Promise<{ id?: string }> {
  const start = args.allDay
    ? {
        date: toIsoDateInTimeZone(args.startAt, args.timeZone),
        timeZone: args.timeZone,
      }
    : {
        dateTime: new Date(args.startAt).toISOString(),
        timeZone: args.timeZone,
      };
  const timedEndAt = getNormalizedTimedEndAt(args.startAt, args.endAt);
  const end = args.allDay
    ? {
        date: addDays(
          args.endAt
            ? toIsoDateInTimeZone(args.endAt, args.timeZone)
            : toIsoDateInTimeZone(args.startAt, args.timeZone),
          1,
        ),
        timeZone: args.timeZone,
      }
    : {
        dateTime: new Date(timedEndAt).toISOString(),
      };

  return googleCalendarFetch<{ id?: string }>(args.accessToken, GOOGLE_CALENDAR_API_BASE_URL, {
    body: JSON.stringify({
      description: args.description,
      end,
      start,
      summary: args.title,
    }),
    method: 'POST',
  });
}

export async function deleteGoogleCalendarEvent(args: {
  accessToken: string;
  eventId: string;
}): Promise<void> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API_BASE_URL}/${encodeURIComponent(args.eventId)}`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
      },
      method: 'DELETE',
    },
  );

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Calendar delete failed (${String(response.status)}): ${body}`);
  }
}
