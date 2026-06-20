import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { requireOrganizationUser } from '../../lib/organization_user';
import { activityMutationDataValidator } from '../../tables/activities';
import { getScopedActivity } from './helpers';

const defaultActivityType = {
  color: '#0EA5E9',
  id: 'meeting',
  label: 'Meeting',
};

function requireTitle(title: string | undefined): string {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle) {
    throw new Error('Activity title is required');
  }

  return trimmedTitle;
}

export const create = mutation({
  args: {
    data: activityMutationDataValidator,
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireOrganizationUser(ctx, args.organizationId);
    const title = requireTitle(args.data.title);
    const assignedUserId = args.data.assignedUserId;
    const participantUserIds = args.data.participantUserIds;
    if (!assignedUserId) {
      throw new Error('Assigned user is required');
    }
    if (!participantUserIds?.length) {
      throw new Error('At least one participant is required');
    }
    const now = Date.now();

    return ctx.db.insert('activities', {
      title,
      activityTypeId: args.data.activityTypeId ?? defaultActivityType.id,
      activityTypeLabel: args.data.activityTypeLabel ?? defaultActivityType.label,
      activityTypeColor: args.data.activityTypeColor ?? defaultActivityType.color,
      assignedUserId,
      participantUserIds,
      visibility: args.data.visibility ?? 'public',
      associations: args.data.associations ?? [],
      tagIds: args.data.tagIds ?? [],
      dueAt: args.data.dueAt,
      startAt: args.data.startAt,
      endAt: args.data.endAt,
      description: args.data.description,
      status: args.data.status ?? 'todo',
      organizationId: args.organizationId,
      createdBy: currentUser._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    data: activityMutationDataValidator,
    id: v.id('activities'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    await getScopedActivity(ctx, args.id, args.organizationId);
    await ctx.db.patch(args.id, {
      ...args.data,
      title: args.data.title?.trim(),
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id('activities'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    await getScopedActivity(ctx, args.id, args.organizationId);
    await ctx.db.delete(args.id);
  },
});
