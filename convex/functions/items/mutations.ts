import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { createItemValidator, itemStatusValidator, updateItemValidator } from '../../tables/items';
import { getScopedItem } from './helpers';

import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

async function requireUserInOrganization(
  ctx: MutationCtx,
  userId: Id<'users'>,
  organizationId: string
): Promise<void> {
  const user = await ctx.db.get(userId);
  if (user?.organizationId !== organizationId) {
    throw new Error('User not found in organization');
  }
}

export const create = mutation({
  args: {
    data: createItemValidator,
    createdBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    await requireUserInOrganization(ctx, args.createdBy, args.data.organizationId);
    if (args.data.assignedTo) {
      await requireUserInOrganization(ctx, args.data.assignedTo, args.data.organizationId);
    }

    const now = Date.now();
    return ctx.db.insert('items', {
      ...args.data,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('items'),
    organizationId: v.string(),
    data: updateItemValidator,
  },
  handler: async (ctx, args) => {
    await getScopedItem(ctx, args.id, args.organizationId);
    if (args.data.assignedTo) {
      await requireUserInOrganization(ctx, args.data.assignedTo, args.organizationId);
    }
    await ctx.db.patch(args.id, { ...args.data, updatedAt: Date.now() });
    return ctx.db.get(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('items'),
    organizationId: v.string(),
    status: itemStatusValidator,
  },
  handler: async (ctx, args) => {
    await getScopedItem(ctx, args.id, args.organizationId);
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() });
    return ctx.db.get(args.id);
  },
});

export const assign = mutation({
  args: {
    id: v.id('items'),
    organizationId: v.string(),
    assignedTo: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    await getScopedItem(ctx, args.id, args.organizationId);
    if (args.assignedTo) {
      await requireUserInOrganization(ctx, args.assignedTo, args.organizationId);
    }
    await ctx.db.patch(args.id, { assignedTo: args.assignedTo, updatedAt: Date.now() });
    return ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id('items'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await getScopedItem(ctx, args.id, args.organizationId);
    await ctx.db.delete(args.id);
  },
});
