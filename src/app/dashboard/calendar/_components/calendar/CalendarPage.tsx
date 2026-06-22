'use client';

import {
  ActivityCalendarView,
  ActivityForm,
  ActivityListView,
  ActivityViewModeToggle,
  type ActivityViewMode,
} from '@carefully-built/saas-kit/agenda';
import { DashboardPageLayout, ResponsivePageActions } from '@carefully-built/saas-kit/app-shell';
import { ResponsiveSheet, TableToolbar } from '@carefully-built/saas-kit';
import { CalendarDays, CircleCheck, Link2, Plus } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import { useCalendarPage } from './useCalendarPage';

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

export function CalendarPage(): React.ReactElement {
  const { activityTypeOptions, agenda, associationOptions, editingActivity, formDefaultValues } =
    useCalendarPage();
  const [viewModeQuery, setViewModeQuery] = useQueryState('view', parseAsString.withDefault('week'));
  const [viewMode, setViewMode] = useState<ActivityViewMode>(() => normalizeViewMode(viewModeQuery));
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
        search={{
          value: agenda.search,
          onChange: agenda.setSearch,
          placeholder: 'Search activities...',
        }}
        filters={[
          {
            config: agenda.activityTypeFilterConfig,
            value: agenda.filters.activityType,
            onChange: (value) => {
              agenda.setFilter('activityType', value);
            },
          },
          {
            config: agenda.operatorFilterConfig,
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
