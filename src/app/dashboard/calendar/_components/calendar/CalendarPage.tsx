'use client';

import { ActivityCalendarView, ActivityForm, type EditableActivity } from '@carefully-built/saas-kit/agenda';
import { DashboardPageLayout } from '@carefully-built/saas-kit/app-shell';
import { ResponsiveSheet } from '@carefully-built/saas-kit';

import { useCalendarPage } from './useCalendarPage';

function submitSheetForm(): void {
  const form = document.getElementById('activity-form');
  if (form instanceof HTMLFormElement) {
    form.requestSubmit();
  }
}

export function CalendarPage(): React.ReactElement {
  const { activityTypeOptions, agenda, associationOptions, editingActivity, formDefaultValues } =
    useCalendarPage();

  return (
    <DashboardPageLayout title="Calendar">
      <ActivityCalendarView
        activities={agenda.filteredActivities}
        anchorDate={agenda.anchorDate}
        calendarSourceFilter={agenda.filters.calendarSource}
        currentUserId={agenda.currentUserId ?? ''}
        scope={agenda.calendarScope}
        showGoogleCalendarEvents={agenda.googleCalendarPreferences.showExistingEvents}
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
