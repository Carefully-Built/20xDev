'use client';

import { DashboardPageLayout } from '@carefully-built/saas-kit/app-shell';
import { SharedActivityCalendarWidget, type ActivityListItem } from '@carefully-built/saas-kit/agenda';
import { BarDistributionWidget, DonutChartWidget } from '@carefully-built/saas-kit/charts';
import { NotificationCenterButton } from '@carefully-built/saas-kit/notifications';
import { EmptyStateCard, SmartTable, type Column } from '@carefully-built/saas-kit';
import { DashboardWidget } from '@carefully-built/saas-kit/widgets';
import {
  Activity,
  CircleDollarSign,
  FileText,
  KanbanSquare,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

import { notificationTabs, notificationTypeMeta } from './notification-display';

import { useFilesByOrganization } from '@/hooks/use-files';
import { useContactSummary, useContactsByOrganization } from '@/hooks/use-contacts';
import { smartTableActionLabels } from '@/lib/toolkit-labels';
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
const chartColors = ['#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b'] as const;
const emptyActivityData: ActivityListItem[] = [];
const emptyChartData: ComponentProps<typeof DonutChartWidget>['data'] = [];

export function OverviewPage(): React.ReactElement {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const contacts = useContactsByOrganization(organizationId, 5);
  const contactSummary = useContactSummary(organizationId);
  const files = useFilesByOrganization(organizationId);
  const notifications = useNotificationsByOrganization(organizationId);
  const markNotificationSeen = useMarkNotificationSeen(organizationId);
  const markAllNotificationsSeen = useMarkAllNotificationsSeen(organizationId);
  const contactCount = contactSummary?.total ?? 0;
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
        <DashboardWidget icon={KanbanSquare} title="Opportunities" value={0} />
        <DashboardWidget
          icon={CircleDollarSign}
          title="Pipeline"
          value={currencyFormatter.format(0)}
        />
        <DashboardWidget icon={FileText} title="Files" value={files?.length ?? 0} />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <DonutChartWidget
          colors={chartColors}
          data={emptyChartData}
          icon={TrendingUp}
          title="Pipeline stages"
        />
        <BarDistributionWidget
          colors={chartColors}
          data={emptyChartData}
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
            actionLabels={smartTableActionLabels}
            noDataMessage="No contacts yet"
            noDataContent={
              <EmptyStateCard
                icon={<UsersRound className="size-7" />}
                title="No contacts yet"
                subtitle="Add contacts to see the newest lead status here."
                actionLabel="Open contacts"
                actionHref="/dashboard/contacts"
              />
            }
          />
        </DashboardWidget>
        <SharedActivityCalendarWidget activities={emptyActivityData} />
      </div>
    </DashboardPageLayout>
  );
}
