import type { AssociationPickerOption } from '@carefully-built/saas-kit/association-picker';
import type { AgendaActivityFormValues, EditableActivity } from '@carefully-built/saas-kit/agenda';

import { useActivityAssociationOptions } from '@/hooks/use-activities';
import { useOrganization } from '@/providers';

import { buildActivityFormDefaults } from './calendar.form-defaults';
import { buildActivityTypeOptions } from './calendar.mapping';
import type { CalendarAgendaState } from './calendar.types';
import { useCalendarAgendaState } from './useCalendarAgendaState';

interface UseCalendarPageResult {
  readonly activityTypeOptions: ReturnType<typeof buildActivityTypeOptions>;
  readonly agenda: CalendarAgendaState;
  readonly associationOptions: AssociationPickerOption[];
  readonly editingActivity: EditableActivity | null;
  readonly formDefaultValues: Partial<AgendaActivityFormValues>;
}

export function useCalendarPage(): UseCalendarPageResult {
  const { organizationId } = useOrganization();
  const associationOptions = useActivityAssociationOptions(organizationId);
  const resolvedAssociationOptions = (associationOptions ?? []) as AssociationPickerOption[];
  const agenda = useCalendarAgendaState({
    associationOptions: resolvedAssociationOptions,
    organizationId,
  });

  return {
    activityTypeOptions: buildActivityTypeOptions(),
    agenda,
    associationOptions: resolvedAssociationOptions,
    editingActivity: agenda.editingActivity,
    formDefaultValues: buildActivityFormDefaults(agenda),
  };
}
