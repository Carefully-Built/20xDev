'use client';

import { DashboardPageLayout } from '@carefully-built/saas-kit/app-shell';
import { NotificationList } from '@carefully-built/saas-kit/notifications';
import { useRouter } from 'next/navigation';

import { notificationTypeMeta } from '../_components/notification-display';

import { useMarkNotificationSeen, useNotificationsByOrganization } from '@/hooks/use-notifications';
import { useOrganization } from '@/providers';

export default function NotificationsPage(): React.ReactElement {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const notifications = useNotificationsByOrganization(organizationId);
  const markNotificationSeen = useMarkNotificationSeen(organizationId);

  return (
    <DashboardPageLayout fillViewport={false} title="Notifications">
      <NotificationList
        notifications={notifications}
        typeMeta={notificationTypeMeta}
        emptyLabel="No notifications"
        onMarkSeen={(notification) => {
          void markNotificationSeen(notification.id);
        }}
        onOpen={(notification) => {
          if (notification.href) {
            router.push(notification.href);
          }
        }}
      />
    </DashboardPageLayout>
  );
}
