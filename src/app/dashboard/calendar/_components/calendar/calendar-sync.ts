interface GoogleCalendarSyncPayload {
  readonly allDay: boolean;
  readonly description?: string;
  readonly endAt?: number;
  readonly startAt?: number;
  readonly title: string;
}

export async function syncCreatedGoogleCalendarEvent(
  payload: GoogleCalendarSyncPayload,
): Promise<string | null> {
  const response = await fetch('/api/integrations/google-calendar/sync', {
    body: JSON.stringify({
      allDay: payload.allDay,
      description: payload.description,
      endAt: payload.endAt,
      startAt: payload.startAt,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      title: payload.title,
    }),
    cache: 'no-store',
    method: 'POST',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { eventId?: string | null };
  return data.eventId ?? null;
}

export async function deleteGoogleCalendarEvent(eventId: string): Promise<boolean> {
  const response = await fetch('/api/integrations/google-calendar/sync', {
    body: JSON.stringify({ eventId }),
    cache: 'no-store',
    method: 'DELETE',
  });

  return response.ok;
}
