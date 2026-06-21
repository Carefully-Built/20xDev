import { useAgendaPageState } from '@carefully-built/agenda';
import { CalendarDays, UserRound } from 'lucide-react';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
import type { AgendaActivityFormValues, EditableActivity } from '@carefully-built/agenda';
import type { Id } from '@convex/_generated/dataModel';

import {
  useActivitiesByOrganization,
  useAttachGoogleCalendarEvent,
  useActivityAssociationOptions,
  useCreateActivity,
  useDeleteActivity,
  useUpdateActivity,
} from '@/hooks/use-activities';
import { useCurrentUserByOrganization, useUsersByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';

import { activityTypes } from './calendar.constants';
import { buildActivityFormDefaults } from './calendar.form-defaults';
import {
  buildActivityTypeOptions,
  toStoredActivityPayload,
} from './calendar.mapping';
import type { CalendarAgendaState } from './calendar.types';
import { resolveGoogleCalendarPreferences } from '@/lib/integrations/google/google-calendar';

interface UseCalendarPageResult {
  readonly activityTypeOptions: ReturnType<typeof buildActivityTypeOptions>;
  readonly agenda: CalendarAgendaState;
  readonly associationOptions: AssociationPickerOption[];
  readonly editingActivity: EditableActivity | null;
  readonly formDefaultValues: Partial<AgendaActivityFormValues>;
}

export function useCalendarPage(): UseCalendarPageResult {
  const { organizationId } = useOrganization();
  const activities = useActivitiesByOrganization(organizationId);
  const users = useUsersByOrganization(organizationId);
  const currentUser = useCurrentUserByOrganization(organizationId);
  const associationOptions = useActivityAssociationOptions(organizationId);
  const resolvedAssociationOptions = (associationOptions ?? []) as AssociationPickerOption[];
  const createActivity = useCreateActivity(organizationId);
  const updateActivity = useUpdateActivity(organizationId);
  const deleteActivity = useDeleteActivity(organizationId);
  const attachGoogleCalendarEvent = useAttachGoogleCalendarEvent(organizationId);
  const googleCalendarPreferences = resolveGoogleCalendarPreferences(
    currentUser?.integrationPreferences,
  );
  const agenda = useAgendaPageState({
    activities,
    activityTypes,
    organizationUsers: users ?? undefined,
    currentUser,
    organizationId,
    associationOptions: resolvedAssociationOptions,
    integrationPreferences: googleCalendarPreferences,
    icons: {
      activityType: CalendarDays,
      operator: UserRound,
    },
    createActivity: async (payload) =>
      String(await createActivity(toStoredActivityPayload(payload, resolvedAssociationOptions))),
    updateActivity: async (id, payload) => {
      await updateActivity(
        id as Id<'activities'>,
        toStoredActivityPayload(payload, resolvedAssociationOptions),
      );
    },
    archiveActivity: async (id) => {
      await deleteActivity(id as Id<'activities'>);
    },
    syncCreatedActivity: async (payload) => {
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
    },
    attachCalendarEvent: async (activityId, eventId) => {
      await attachGoogleCalendarEvent({
        googleCalendarEventId: eventId,
        id: activityId as Id<'activities'>,
      });
    },
    deleteCalendarEvent: async (eventId) => {
      const response = await fetch('/api/integrations/google-calendar/sync', {
        body: JSON.stringify({ eventId }),
        cache: 'no-store',
        method: 'DELETE',
      });

      return response.ok;
    },
    createActivityType: () => Promise.resolve(activityTypes[0]._id),
    updateActivityType: () => Promise.resolve(),
    archiveActivityType: () => Promise.resolve(),
  }) as CalendarAgendaState;

  return {
    activityTypeOptions: buildActivityTypeOptions(),
    agenda,
    associationOptions: resolvedAssociationOptions,
    editingActivity: agenda.editingActivity,
    formDefaultValues: buildActivityFormDefaults(agenda),
  };
}
