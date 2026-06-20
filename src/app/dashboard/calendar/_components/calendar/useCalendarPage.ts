import { useAgendaPageState } from '@carefully-built/agenda';
import { CalendarDays, UserRound } from 'lucide-react';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
import type { AgendaActivityFormValues, EditableActivity } from '@carefully-built/agenda';
import type { Id } from '@convex/_generated/dataModel';

import {
  useActivitiesByOrganization,
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
  const agenda = useAgendaPageState({
    activities,
    activityTypes,
    organizationUsers: users ?? undefined,
    currentUser,
    organizationId,
    associationOptions: resolvedAssociationOptions,
    integrationPreferences: { showExistingEvents: false, syncDashboardEvents: false },
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
