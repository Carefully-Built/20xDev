'use client';

import {
  ActivityCalendarView,
  ActivityForm,
  ActivityListView,
  type ActivityCalendarScope,
} from '@carefully-built/saas-kit/agenda';
import { DashboardPageLayout, ResponsivePageActions } from '@carefully-built/saas-kit/app-shell';
import { ResponsiveSheet, TableToolbar } from '@carefully-built/saas-kit';
import {
  Calendar1,
  CalendarDays,
  CalendarRange,
  CircleCheck,
  Columns3,
  Link2,
  List,
  Plus,
} from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { buildItalianAllOptionLabel, tableToolbarLabels } from '@/lib/toolkit-labels';

import { useCalendarPage } from './useCalendarPage';

type ActivityViewMode = ActivityCalendarScope | 'list';

const activityStatusOptions = [
  { value: 'todo', label: 'To do' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

const calendarSourceOptions = [
  { value: 'all', label: 'All calendars' },
  { value: 'dashboard-only', label: 'Dashboard only' },
  { value: 'google-linked', label: 'Google linked' },
  { value: 'google-only', label: 'Google only' },
] as const;

const activityViewModeOptions = [
  { value: 'list', label: 'List', tooltip: 'Show activities as a list', icon: List },
  { value: 'day', label: 'Day', tooltip: 'Show one day', icon: Calendar1 },
  { value: 'week', label: 'Week', tooltip: 'Show the week', icon: Columns3 },
  { value: 'month', label: 'Month', tooltip: 'Show the month', icon: CalendarRange },
] as const satisfies readonly {
  value: ActivityViewMode;
  label: string;
  tooltip: string;
  icon: typeof List;
}[];

function submitSheetForm(): void {
  const form = document.getElementById('activity-form');
  if (form instanceof HTMLFormElement) {
    form.requestSubmit();
  }
}

function normalizeViewMode(value: string): ActivityViewMode {
  return value === 'list' || value === 'month' || value === 'day' || value === 'week'
    ? value
    : 'week';
}

interface ActivityViewModeToggleProps {
  readonly value: ActivityViewMode;
  readonly onChange: (value: ActivityViewMode) => void;
}

function ActivityViewModeToggle({
  value,
  onChange,
}: ActivityViewModeToggleProps): React.ReactElement {
  return (
    <TooltipProvider>
      <ToggleGroup
        type="single"
        value={value}
        variant="outline"
        size="sm"
        aria-label="Calendar view"
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as ActivityViewMode);
          }
        }}
      >
        {activityViewModeOptions.map(({ value: optionValue, label, tooltip, icon: Icon }) => (
          <Tooltip key={optionValue}>
            <TooltipTrigger asChild>
              <ToggleGroupItem value={optionValue} aria-label={label}>
                <Icon className="size-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
}

export function CalendarPage(): React.ReactElement {
  const { activityTypeOptions, agenda, associationOptions, editingActivity, formDefaultValues } =
    useCalendarPage();
  const [viewModeQuery, setViewModeQuery] = useQueryState(
    'view',
    parseAsString.withDefault('week'),
  );
  const [viewMode, setViewMode] = useState<ActivityViewMode>(() =>
    normalizeViewMode(viewModeQuery),
  );
  const showListView = viewMode === 'list';

  useEffect(() => {
    const nextViewMode = normalizeViewMode(viewModeQuery);
    setViewMode(nextViewMode);

    if (nextViewMode !== 'list' && nextViewMode !== agenda.calendarScope) {
      agenda.setCalendarScope(nextViewMode);
    }
  }, [agenda, agenda.calendarScope, viewModeQuery]);

  function handleViewModeChange(nextViewMode: ActivityViewMode): void {
    setViewMode(nextViewMode);
    void setViewModeQuery(nextViewMode === 'week' ? null : nextViewMode);

    if (nextViewMode !== 'list') {
      agenda.setCalendarScope(nextViewMode);
    }
  }

  return (
    <DashboardPageLayout
      title="Calendar"
      actions={
        <ResponsivePageActions
          primaryAction={{
            icon: <Plus className="size-4" />,
            label: 'Add event',
            onClick: () => {
              agenda.openCreateSheetForDate(new Date());
            },
          }}
        />
      }
    >
      <TableToolbar
        labels={tableToolbarLabels}
        search={{
          value: agenda.search,
          onChange: agenda.setSearch,
          placeholder: 'Search activities...',
        }}
        filters={[
          {
            config: agenda.activityTypeFilterConfig,
            allOptionLabel: buildItalianAllOptionLabel(agenda.activityTypeFilterConfig.label),
            value: agenda.filters.activityType,
            onChange: (value) => {
              agenda.setFilter('activityType', value);
            },
          },
          {
            config: agenda.operatorFilterConfig,
            allOptionLabel: buildItalianAllOptionLabel(agenda.operatorFilterConfig.label),
            value: agenda.filters.operator,
            onChange: (value) => {
              agenda.setFilter('operator', value);
            },
          },
          {
            config: {
              key: 'association',
              label: 'Association',
              icon: Link2,
              options: agenda.associationFilterOptions.map((option) => ({
                value: option.value,
                label: option.label,
              })),
            },
            allOptionLabel: buildItalianAllOptionLabel('Association'),
            value: agenda.filters.association,
            onChange: (value) => {
              agenda.setFilter('association', value);
            },
          },
          {
            config: {
              key: 'status',
              label: 'Status',
              icon: CircleCheck,
              options: activityStatusOptions,
            },
            allOptionLabel: buildItalianAllOptionLabel('Status'),
            value: agenda.filters.status,
            onChange: (value) => {
              agenda.setFilter('status', value);
            },
          },
          {
            config: {
              key: 'calendarSource',
              label: 'Calendar',
              icon: CalendarDays,
              options: calendarSourceOptions,
            },
            allOptionLabel: buildItalianAllOptionLabel('Calendar'),
            value: agenda.filters.calendarSource,
            onChange: (value) => {
              agenda.setFilter('calendarSource', value);
            },
          },
        ]}
        rangeFilters={[
          {
            key: 'date',
            label: 'Date',
            icon: CalendarDays,
            minValue: agenda.filters.dateFrom,
            maxValue: agenda.filters.dateTo,
            minPlaceholder: 'From',
            maxPlaceholder: 'To',
            inputType: 'date',
            onMinChange: (value) => {
              agenda.setFilter('dateFrom', value);
            },
            onMaxChange: (value) => {
              agenda.setFilter('dateTo', value);
            },
          },
        ]}
        onClearAll={agenda.clearFilters}
        getDraftResultCount={agenda.getDraftFilterResultCount}
      >
        <ActivityViewModeToggle value={viewMode} onChange={handleViewModeChange} />
      </TableToolbar>
      <div className="sm:hidden">
        <ActivityViewModeToggle value={viewMode} onChange={handleViewModeChange} />
      </div>
      {showListView ? (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <ActivityListView
            activities={agenda.filteredActivities}
            currentUserId={agenda.currentUserId ?? ''}
            onCreate={() => {
              agenda.openCreateSheetForDate(new Date());
            }}
            onEdit={agenda.openEditSheet}
          />
        </div>
      ) : (
        <ActivityCalendarView
          activities={agenda.filteredActivities}
          anchorDate={agenda.anchorDate}
          calendarSourceFilter={agenda.filters.calendarSource}
          currentUserId={agenda.currentUserId ?? ''}
          scope={agenda.calendarScope}
          showGoogleCalendarEvents={agenda.googleCalendarPreferences.showExistingEvents}
          onAnchorDateChange={agenda.setAnchorDate}
          onDateClick={agenda.openCreateSheetForDate}
          onEdit={agenda.openEditSheet}
          onMoveActivity={agenda.moveActivity}
          onScopeChange={agenda.setCalendarScope}
        />
      )}
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
          associationOptions={associationOptions}
          participantOptions={agenda.participantOptions}
          activityTypeOptions={activityTypeOptions}
          defaultValues={formDefaultValues}
          onSubmit={(values) => {
            void agenda.submitActivity(values);
          }}
        />
      </ResponsiveSheet>
    </DashboardPageLayout>
  );
}
