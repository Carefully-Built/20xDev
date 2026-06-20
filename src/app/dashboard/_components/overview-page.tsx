'use client';

import { DashboardPageLayout } from '@carefully-built/app-shell';
import { SharedActivityCalendarWidget } from '@carefully-built/agenda';
import { BarDistributionWidget, DonutChartWidget } from '@carefully-built/charts';
import { NotificationCenterButton } from '@carefully-built/notifications';
import { SmartTable, type Column } from '@carefully-built/ui';
import { DashboardWidget } from '@carefully-built/widgets';
import {
  Activity,
  CircleDollarSign,
  FileText,
  KanbanSquare,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { documents } from '../files/_data';
import { opportunities } from '../opportunities/_data';
import {
  dashboardActivities,
  chartColors,
  notificationTabs,
  notificationTypeMeta,
  stageChartData,
  weeklyActivityData,
} from '../_data/dashboard-overview-data';

import { useContactSummary, useContactsByOrganization } from '@/hooks/use-contacts';
import {
  useMarkAllNotificationsSeen,
  useMarkNotificationSeen,
  useNotificationsByOrganization,
} from '@/hooks/use-notifications';
import { useOrganization } from '@/providers';

import type { Doc } from '@convex/_generated/dataModel';

type Contact = Doc<'contacts'>;

const contactColumns: Column<Contact>[] = [
  { accessor: 'name', header: 'Name' },
  { accessor: 'company', header: 'Company' },
  { accessor: 'status', header: 'Status' },
  { accessor: 'owner', header: 'Owner' },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

export function OverviewPage(): React.ReactElement {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const contacts = useContactsByOrganization(organizationId, 5);
  const contactSummary = useContactSummary(organizationId);
  const notifications = useNotificationsByOrganization(organizationId);
  const markNotificationSeen = useMarkNotificationSeen(organizationId);
  const markAllNotificationsSeen = useMarkAllNotificationsSeen(organizationId);
  const contactCount = contactSummary?.total ?? 0;
  const pipelineValue = opportunities.reduce(
    (total, opportunity) => total + (opportunity.value ?? 0),
    0,
  );
  const unreadCount = notifications?.filter((notification) => !notification.seenAt).length ?? 0;

  return (
    <DashboardPageLayout
      fillViewport={false}
      title="Dashboard"
      actions={
        <NotificationCenterButton
          notifications={notifications}
          tabs={notificationTabs}
          typeMeta={notificationTypeMeta}
          unreadCount={unreadCount}
          onMarkSeen={(notification) => {
            void markNotificationSeen(notification.id);
          }}
          onMarkAllSeen={() => {
            void markAllNotificationsSeen();
          }}
          onOpenNotification={(notification) => {
            if (notification.href) {
              router.push(notification.href);
            }
          }}
          localeConfig={{
            allTabLabel: 'All',
            description: 'Recent workspace updates.',
            emptyAllLabel: 'No notifications',
            emptyFilteredLabel: 'No notifications here',
            markAllSeenLabel: 'Mark all read',
            openNotificationsLabel: 'Open notifications',
            title: 'Notifications',
            tooltipLabel: 'Notifications',
          }}
        />
      }
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DashboardWidget icon={UsersRound} title="Contacts" value={contactCount} />
        <DashboardWidget icon={KanbanSquare} title="Opportunities" value={opportunities.length} />
        <DashboardWidget
          icon={CircleDollarSign}
          title="Pipeline"
          value={currencyFormatter.format(pipelineValue)}
        />
        <DashboardWidget icon={FileText} title="Files" value={documents.length} />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <DonutChartWidget
          colors={chartColors}
          data={stageChartData}
          icon={TrendingUp}
          title="Pipeline stages"
        />
        <BarDistributionWidget
          colors={chartColors}
          data={weeklyActivityData}
          icon={Activity}
          title="Weekly activity"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <DashboardWidget icon={UsersRound} title="Lead status" contentClassName="p-0">
          <SmartTable
            columns={contactColumns}
            data={contacts ? [...contacts] : []}
            isLoading={Boolean(organizationId) && contacts === undefined}
            getRowKey={(contact) => contact._id}
            noDataMessage="No contacts yet"
          />
        </DashboardWidget>
        <SharedActivityCalendarWidget activities={dashboardActivities} />
      </div>
    </DashboardPageLayout>
  );
}
