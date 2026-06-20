import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getOrganizationUser } from '../../lib/organization_user';
import { formatUserName, listUsersById } from './helpers';

export const listByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return [];
    }

    const activities = await ctx.db
      .query('activities')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .collect();
    const userIds = [
      ...new Set(
        activities.flatMap((activity) => [
          activity.assignedUserId,
          ...activity.participantUserIds,
        ]),
      ),
    ];
    const userMap = await listUsersById(ctx, userIds);

    return activities.map((activity) => ({
      ...activity,
      assignedUserName: formatUserName(userMap.get(String(activity.assignedUserId))),
      participantUserNames: activity.participantUserIds.map((id) =>
        formatUserName(userMap.get(String(id))),
      ),
    }));
  },
});

export const listAssociationOptions = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return [];
    }

    const [contacts, files] = await Promise.all([
      ctx.db
        .query('contacts')
        .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
        .collect(),
      ctx.db
        .query('files')
        .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
        .collect(),
    ]);

    return [
      ...contacts.map((contact) => ({
        entityId: String(contact._id),
        entityType: 'contact' as const,
        label: contact.name,
        typeLabel: 'Contact',
        value: `contact:${contact._id}`,
      })),
      ...files.map((file) => ({
        entityId: String(file._id),
        entityType: 'file' as const,
        label: file.name,
        typeLabel: 'File',
        value: `file:${file._id}`,
      })),
    ];
  },
});
