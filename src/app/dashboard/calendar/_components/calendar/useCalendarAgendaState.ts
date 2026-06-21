import { useAgendaPageState } from '@carefully-built/saas-kit/agenda';
import { CalendarDays, UserRound } from 'lucide-react';

import type { AssociationPickerOption } from '@carefully-built/saas-kit/association-picker';
import type { Id } from '@convex/_generated/dataModel';

import {
  useActivitiesByOrganization,
  useAttachGoogleCalendarEvent,
  useCreateActivity,
  useDeleteActivity,
  useUpdateActivity,
} from '@/hooks/use-activities';
import { useCurrentUserByOrganization, useUsersByOrganization } from '@/hooks/use-users';
import { resolveGoogleCalendarPreferences } from '@/lib/integrations/google/google-calendar';

import { activityTypes } from './calendar.constants';
import { toStoredActivityPayload } from './calendar.mapping';
import { deleteGoogleCalendarEvent, syncCreatedGoogleCalendarEvent } from './calendar-sync';
import type { CalendarAgendaState } from './calendar.types';

interface UseCalendarAgendaStateArgs {
  readonly associationOptions: readonly AssociationPickerOption[];
  readonly organizationId: string | null | undefined;
}

export function useCalendarAgendaState({
  associationOptions,
  organizationId,
}: UseCalendarAgendaStateArgs): CalendarAgendaState {
  const activities = useActivitiesByOrganization(organizationId);
  const users = useUsersByOrganization(organizationId);
  const currentUser = useCurrentUserByOrganization(organizationId);
  const createActivity = useCreateActivity(organizationId);
  const updateActivity = useUpdateActivity(organizationId);
  const deleteActivity = useDeleteActivity(organizationId);
  const attachGoogleCalendarEvent = useAttachGoogleCalendarEvent(organizationId);
  const googleCalendarPreferences = resolveGoogleCalendarPreferences(
    currentUser?.integrationPreferences,
  );

  return useAgendaPageState({
    activities,
    activityTypes,
    organizationUsers: users ?? undefined,
    currentUser,
    organizationId,
    associationOptions,
    integrationPreferences: googleCalendarPreferences,
    icons: {
      activityType: CalendarDays,
      operator: UserRound,
    },
    createActivity: async (payload) =>
      String(await createActivity(toStoredActivityPayload(payload, associationOptions))),
    updateActivity: async (id, payload) => {
      await updateActivity(
        id as Id<'activities'>,
        toStoredActivityPayload(payload, associationOptions),
      );
    },
    archiveActivity: async (id) => {
      await deleteActivity(id as Id<'activities'>);
    },
    syncCreatedActivity: syncCreatedGoogleCalendarEvent,
    attachCalendarEvent: async (activityId, eventId) => {
      await attachGoogleCalendarEvent({
        googleCalendarEventId: eventId,
        id: activityId as Id<'activities'>,
      });
    },
    deleteCalendarEvent: deleteGoogleCalendarEvent,
    createActivityType: () => Promise.resolve(activityTypes[0]._id),
    updateActivityType: () => Promise.resolve(),
    archiveActivityType: () => Promise.resolve(),
  }) as CalendarAgendaState;
}
