import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getOrganizationUser } from '../../lib/organization_user';
import { notificationTypeValidator } from '../../tables/notifications';
import { toNotificationRecord } from './helpers';

export const listByOrganization = query({
  args: {
    limit: v.optional(v.number()),
    organizationId: v.string(),
    type: v.optional(notificationTypeValidator),
  },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return [];
    }

    const limit = Math.min(args.limit ?? 50, 100);
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_organization_created', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .take(limit);

    const filteredNotifications = args.type
      ? notifications.filter((notification) => notification.type === args.type)
      : notifications;

    return filteredNotifications.map(toNotificationRecord);
  },
});
