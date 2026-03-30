import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { itemPriorityValidator, itemStatusValidator } from '../../tables/items';
import { requireOrganizationUser } from './auth';
import { getScopedItem } from './helpers';

export const getById = query({
  args: {
    id: v.id('items'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    return getScopedItem(ctx, args.id, args.organizationId);
  },
});

export const listByOrganization = query({
  args: {
    organizationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    const items = await ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
    return args.limit ? items.slice(0, args.limit) : items;
  },
});

export const listByStatus = query({
  args: {
    organizationId: v.string(),
    status: itemStatusValidator,
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    return ctx.db
      .query('items')
      .withIndex('by_status', (q) => q.eq('organizationId', args.organizationId).eq('status', args.status))
      .collect();
  },
});

export const listByPriority = query({
  args: {
    organizationId: v.string(),
    priority: itemPriorityValidator,
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    return ctx.db
      .query('items')
      .withIndex('by_priority', (q) => q.eq('organizationId', args.organizationId).eq('priority', args.priority))
      .collect();
  },
});

export const listByAssignee = query({
  args: {
    assignedTo: v.id('users'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    return ctx.db
      .query('items')
      .withIndex('by_assigned', (q) => q.eq('organizationId', args.organizationId).eq('assignedTo', args.assignedTo))
      .collect();
  },
});

export const countByStatus = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    const items = await ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
    return {
      draft: items.filter((item) => item.status === 'draft').length,
      active: items.filter((item) => item.status === 'active').length,
      archived: items.filter((item) => item.status === 'archived').length,
      total: items.length,
    };
  },
});
