import type {
  ActivityCalendarScope,
  ActivityFilters,
  ActivityForm,
  ActivityListItem,
  AgendaActivityFormValues,
  AgendaFilterConfig,
  EditableActivity,
} from '@carefully-built/saas-kit/agenda';

import type { Id } from '@convex/_generated/dataModel';
import type { GoogleCalendarPreferences } from '@/lib/integrations/google/google-calendar';

export interface CalendarAgendaState {
  readonly filteredActivities: EditableActivity[];
  readonly anchorDate: Date;
  readonly currentUserId: string | null;
  readonly calendarScope: ActivityCalendarScope;
  readonly search: string;
  readonly filters: ActivityFilters;
  readonly activityTypeFilterConfig: AgendaFilterConfig;
  readonly operatorFilterConfig: AgendaFilterConfig;
  readonly associationFilterOptions: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly googleCalendarPreferences: GoogleCalendarPreferences;
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
  readonly setSearch: (value: string) => void;
  readonly setFilter: (key: keyof ActivityFilters, value: string) => void;
  readonly clearFilters: () => void;
  readonly getDraftFilterResultCount: (draftValues: Record<string, string>) => number | undefined;
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

export interface StoredActivityAssociation {
  readonly entityId: string;
  readonly entityType: 'contact' | 'opportunity' | 'document' | 'file';
  readonly label: string;
  readonly typeLabel: string;
  readonly value: string;
}

export interface StoredActivityData {
  readonly title?: string;
  readonly activityTypeId?: string;
  readonly activityTypeLabel?: string;
  readonly activityTypeColor?: string;
  readonly assignedUserId?: Id<'users'>;
  readonly participantUserIds?: Id<'users'>[];
  readonly visibility?: 'public' | 'private';
  readonly associations?: StoredActivityAssociation[];
  readonly tagIds?: string[];
  readonly dueAt?: number;
  readonly startAt?: number;
  readonly endAt?: number;
  readonly googleCalendarEventId?: string;
  readonly description?: string;
  readonly status?: 'todo' | 'scheduled' | 'done' | 'cancelled';
}
