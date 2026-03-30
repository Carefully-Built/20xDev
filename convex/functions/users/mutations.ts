import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { upsertUserRecord } from '../../lib/workos-user-sync';
import { createUserValidator, updateUserValidator } from '../../tables/users';

export const create = mutation({
  args: createUserValidator,
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('users', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('users'),
    data: updateUserValidator,
  },
  handler: async (ctx, args) => {
    const { id, data } = args;
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const syncFromWorkOS = mutation({
  args: createUserValidator,
  handler: async (ctx, args) => {
    return upsertUserRecord(ctx, {
      workosId: args.workosId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
    }, args.organizationId, args.role);
  },
});

export const updateOrganizationContext = mutation({
  args: {
    workosId: v.string(),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .first();

    if (!user || !args.organizationId) {
      return null;
    }

    return upsertUserRecord(ctx, {
      workosId: user.workosId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }, args.organizationId, user.role);
  },
});
