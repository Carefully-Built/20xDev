'use client';

import {
  ActivityForm,
  ActivityCalendarView,
  formatDateInputValue,
  formatTimeInputValue,
  isAllDayActivityRange,
  useAgendaPageState,
  type ActivityCalendarScope,
  type ActivityListItem,
  type AgendaActivityFormValues,
  type AgendaActivityMutationPayload,
  type EditableActivity,
} from '@carefully-built/agenda';
import { DashboardPageLayout } from '@carefully-built/app-shell';
import { ResponsiveSheet } from '@carefully-built/ui';
import { CalendarDays, UserRound } from 'lucide-react';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
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

const activityTypes = [
  { _id: 'meeting', label: 'Meeting', color: '#0EA5E9' },
  { _id: 'call', label: 'Call', color: '#06B6D4' },
  { _id: 'review', label: 'Review', color: '#22C55E' },
] as const;

interface CalendarAgendaState {
  readonly filteredActivities: EditableActivity[];
  readonly anchorDate: Date;
  readonly currentUserId: string | null;
  readonly calendarScope: ActivityCalendarScope;
  readonly isSheetOpen: boolean;
  readonly editingActivity: EditableActivity | null;
  readonly participantOptions: React.ComponentProps<typeof ActivityForm>['participantOptions'];
  readonly createDraftPreset: {
    readonly date: string;
    readonly allDay: boolean;
    readonly startTime: string;
    readonly endTime: string;
  };
  readonly setAnchorDate: (date: Date) => void;
  readonly openCreateSheetForDate: (start: Date, end?: Date | null, allDay?: boolean) => void;
  readonly openEditSheet: (activity: EditableActivity) => void;
  readonly moveActivity: (
    activity: ActivityListItem,
    start: Date,
    end?: Date | null,
  ) => Promise<void>;
  readonly setCalendarScope: (scope: ActivityCalendarScope) => void;
  readonly syncSheetOpen: (open: boolean) => void;
  readonly submitActivity: (values: AgendaActivityFormValues) => Promise<void>;
}

function submitSheetForm(): void {
  const form = document.getElementById('activity-form');
  if (form instanceof HTMLFormElement) {
    form.requestSubmit();
  }
}

function resolveActivityType(activityTypeId: string): (typeof activityTypes)[number] {
  return activityTypes.find((type) => type._id === activityTypeId) ?? activityTypes[0];
}

interface StoredActivityData {
  readonly title?: string;
  readonly activityTypeId?: string;
  readonly activityTypeLabel?: string;
  readonly activityTypeColor?: string;
  readonly assignedUserId?: Id<'users'>;
  readonly participantUserIds?: Id<'users'>[];
  readonly visibility?: 'public' | 'private';
  readonly associations?: {
    readonly entityId: string;
    readonly entityType: 'contact' | 'opportunity' | 'document' | 'file';
    readonly label: string;
    readonly typeLabel: string;
    readonly value: string;
  }[];
  readonly tagIds?: string[];
  readonly dueAt?: number;
  readonly startAt?: number;
  readonly endAt?: number;
  readonly description?: string;
  readonly status?: 'todo' | 'scheduled' | 'done' | 'cancelled';
}

function resolveAssociations(
  payloadAssociations: AgendaActivityMutationPayload['associations'] | undefined,
  options: readonly AssociationPickerOption[],
): StoredActivityData['associations'] {
  if (!payloadAssociations) {
    return undefined;
  }

  return payloadAssociations.flatMap((association) => {
    const option = options.find(
      (candidate) =>
        candidate.entityId === association.entityId &&
        candidate.entityType === association.entityType,
    );

    if (
      !option ||
      !['contact', 'opportunity', 'document', 'file'].includes(option.entityType)
    ) {
      return [];
    }

    return [
      {
        entityId: option.entityId,
        entityType: option.entityType as 'contact' | 'opportunity' | 'document' | 'file',
        label: option.label,
        typeLabel: option.typeLabel,
        value: option.value,
      },
    ];
  });
}

function stripUndefinedValues(data: StoredActivityData): StoredActivityData {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as StoredActivityData;
}

function toStoredPayload(
  payload: Partial<AgendaActivityMutationPayload>,
  associationOptions: readonly AssociationPickerOption[],
): StoredActivityData {
  const activityType = payload.activityTypeId ? resolveActivityType(payload.activityTypeId) : null;

  return stripUndefinedValues({
    title: payload.title,
    activityTypeId: payload.activityTypeId,
    activityTypeLabel: activityType?.label,
    activityTypeColor: activityType?.color,
    assignedUserId: payload.assignedUserId as Id<'users'> | undefined,
    participantUserIds: payload.participantUserIds as Id<'users'>[] | undefined,
    visibility: payload.visibility,
    associations: resolveAssociations(payload.associations, associationOptions),
    tagIds: payload.tagIds ? [...payload.tagIds] : undefined,
    dueAt: payload.dueAt,
    startAt: payload.startAt,
    endAt: payload.endAt,
    description: payload.description,
    status: payload.status,
  });
}

export default function CalendarPage(): React.ReactElement {
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
      String(await createActivity(toStoredPayload(payload, resolvedAssociationOptions))),
    updateActivity: async (id, payload) => {
      await updateActivity(id as Id<'activities'>, toStoredPayload(payload, resolvedAssociationOptions));
    },
    archiveActivity: async (id) => {
      await deleteActivity(id as Id<'activities'>);
    },
    createActivityType: () => Promise.resolve(activityTypes[0]._id),
    updateActivityType: () => Promise.resolve(),
    archiveActivityType: () => Promise.resolve(),
  }) as CalendarAgendaState;
  const editingActivity = agenda.editingActivity;
  const defaultActivityTypeId = activityTypes[0]._id;

  return (
    <DashboardPageLayout title="Calendar">
      <ActivityCalendarView
        activities={agenda.filteredActivities}
        anchorDate={agenda.anchorDate}
        calendarSourceFilter="dashboard"
        currentUserId={agenda.currentUserId ?? ''}
        scope={agenda.calendarScope}
        showGoogleCalendarEvents={false}
        onAnchorDateChange={agenda.setAnchorDate}
        onDateClick={agenda.openCreateSheetForDate}
        onEdit={(activity) => {
          agenda.openEditSheet(activity as EditableActivity);
        }}
        onMoveActivity={agenda.moveActivity}
        onScopeChange={agenda.setCalendarScope}
      />
      <ResponsiveSheet
        open={agenda.isSheetOpen}
        onOpenChange={agenda.syncSheetOpen}
        title={editingActivity ? 'Edit activity' : 'Add activity'}
        onCancel={() => {
          agenda.syncSheetOpen(false);
        }}
        onConfirm={submitSheetForm}
        confirmLabel={editingActivity ? 'Save changes' : 'Add'}
      >
        <ActivityForm
          associationOptions={resolvedAssociationOptions}
          participantOptions={agenda.participantOptions}
          activityTypeOptions={activityTypes.map((type) => ({
            value: type._id,
            label: type.label,
            color: type.color,
          }))}
          defaultValues={
            editingActivity
              ? {
                  title: editingActivity.title,
                  activityTypeId: editingActivity.activityTypeId,
                  participantUserIds: editingActivity.participantUserIds.map(String),
                  visibility: editingActivity.visibility === 'private' ? 'private' : 'public',
                  associations: editingActivity.associations.map(
                    (association: { readonly value: string }) => association.value,
                  ),
                  tagIds: editingActivity.tagIds ?? [],
                  date: formatDateInputValue(editingActivity.startAt),
                  allDay: isAllDayActivityRange(
                    editingActivity.startAt,
                    editingActivity.endAt,
                  ),
                  startTime: formatTimeInputValue(editingActivity.startAt),
                  endTime: formatTimeInputValue(editingActivity.endAt),
                  description: editingActivity.description ?? '',
                  status: editingActivity.status,
                }
              : {
                  activityTypeId: defaultActivityTypeId,
                  participantUserIds: agenda.currentUserId ? [agenda.currentUserId] : [],
                  visibility: 'public',
                  status: 'todo',
                  tagIds: [],
                  date: agenda.createDraftPreset.date,
                  allDay: agenda.createDraftPreset.allDay,
                  startTime: agenda.createDraftPreset.startTime,
                  endTime: agenda.createDraftPreset.endTime,
                }
          }
          onSubmit={(values) => {
            void agenda.submitActivity(values);
          }}
        />
      </ResponsiveSheet>
    </DashboardPageLayout>
  );
}
