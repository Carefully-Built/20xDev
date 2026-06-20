import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { requireOrganizationUser } from '../../lib/organization_user';
import { getScopedNotification } from './helpers';

export const markSeen = mutation({
  args: {
    id: v.id('notifications'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    const notification = await getScopedNotification(ctx, args.id, args.organizationId);

    if (notification.seenAt) {
      return notification._id;
    }

    await ctx.db.patch(notification._id, { seenAt: Date.now() });
    return notification._id;
  },
});

export const markAllSeen = mutation({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_organization_created', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .take(100);
    const now = Date.now();

    await Promise.all(
      notifications
        .filter((notification) => !notification.seenAt)
        .map((notification) => ctx.db.patch(notification._id, { seenAt: now })),
    );
  },
});
