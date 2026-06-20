import type { AgendaActivityFormValues, EditableActivity } from '@carefully-built/agenda';

import { defaultActivityType } from './calendar.constants';
import type { CalendarAgendaState } from './calendar.types';

const allDayActivityStartTime = '00:00';
const allDayActivityEndTime = '23:59';

function formatDateInputValue(timestamp: number | undefined): string {
  if (typeof timestamp !== 'number') {
    return '';
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${String(year)}-${month}-${day}`;
}

function formatTimeInputValue(timestamp: number | undefined): string {
  if (typeof timestamp !== 'number') {
    return '';
  }

  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function isAllDayActivityRange(startAt?: number, endAt?: number): boolean {
  if (!startAt || !endAt) {
    return false;
  }

  return (
    formatTimeInputValue(startAt) === allDayActivityStartTime &&
    formatTimeInputValue(endAt) === allDayActivityEndTime
  );
}

function buildEditingActivityDefaults(
  editingActivity: EditableActivity,
): Partial<AgendaActivityFormValues> {
  return {
    title: editingActivity.title,
    activityTypeId: editingActivity.activityTypeId,
    participantUserIds: editingActivity.participantUserIds.map(String),
    visibility: editingActivity.visibility === 'private' ? 'private' : 'public',
    associations: editingActivity.associations.map(
      (association: { readonly value: string }) => association.value,
    ),
    tagIds: editingActivity.tagIds ?? [],
    date: formatDateInputValue(editingActivity.startAt),
    allDay: isAllDayActivityRange(editingActivity.startAt, editingActivity.endAt),
    startTime: formatTimeInputValue(editingActivity.startAt),
    endTime: formatTimeInputValue(editingActivity.endAt),
    description: editingActivity.description ?? '',
    status: editingActivity.status,
  };
}

export function buildActivityFormDefaults(
  agenda: Pick<CalendarAgendaState, 'createDraftPreset' | 'currentUserId' | 'editingActivity'>,
): Partial<AgendaActivityFormValues> {
  if (agenda.editingActivity) {
    return buildEditingActivityDefaults(agenda.editingActivity);
  }

  return {
    activityTypeId: defaultActivityType._id,
    participantUserIds: agenda.currentUserId ? [agenda.currentUserId] : [],
    visibility: 'public',
    status: 'todo',
    tagIds: [],
    date: agenda.createDraftPreset.date,
    allDay: agenda.createDraftPreset.allDay,
    startTime: agenda.createDraftPreset.startTime,
    endTime: agenda.createDraftPreset.endTime,
  };
}
