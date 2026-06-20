import type { Doc } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';
import type { NotificationRecordInput } from './builders';

export function toNotificationRecord(notification: Doc<'notifications'>) {
  return {
    createdAt: notification.createdAt,
    href: notification.href,
    id: notification._id,
    message: notification.message,
    seenAt: notification.seenAt,
    source: notification.source,
    title: notification.title,
    type: notification.type,
    typeLabel: notification.typeLabel,
  };
}

export async function getScopedNotification(
  ctx: MutationCtx | QueryCtx,
  id: Doc<'notifications'>['_id'],
  organizationId: string,
): Promise<Doc<'notifications'>> {
  const notification = await ctx.db.get(id);

  if (notification?.organizationId !== organizationId) {
    throw new Error('Notification not found');
  }

  return notification;
}

export async function createNotification(
  ctx: MutationCtx,
  notification: NotificationRecordInput,
): Promise<Doc<'notifications'>['_id']> {
  return ctx.db.insert('notifications', notification);
}
