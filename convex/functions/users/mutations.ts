import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { requireOrgAdmin, requireSameOrg } from '../../lib/auth';
import { createUserValidator, updateUserValidator } from '../../tables/users';

export const create = mutation({
  args: createUserValidator,
  handler: async (ctx, args) => {
    const caller = await requireOrgAdmin(ctx);
    requireSameOrg(caller, args.organizationId);

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
    const caller = await requireOrgAdmin(ctx);

    const target = await ctx.db.get(id);
    if (!target) {
      throw new Error('Not found: user does not exist');
    }
    requireSameOrg(caller, target.organizationId);

    // Prevent moving a user out of the caller's organization.
    if (data.organizationId !== undefined) {
      requireSameOrg(caller, data.organizationId);
    }

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
    const caller = await requireOrgAdmin(ctx);

    const target = await ctx.db.get(args.id);
    if (!target) {
      throw new Error('Not found: user does not exist');
    }
    requireSameOrg(caller, target.organizationId);

    await ctx.db.delete(args.id);
  },
});

export const syncFromWorkOS = mutation({
  args: createUserValidator,
  handler: async (ctx, args) => {
    // Check if user exists by WorkOS ID
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        organizationId: args.organizationId,
        role: args.role,
        updatedAt: now,
      });
      return existingUser._id;
    } else {
      // Create new user
      return await ctx.db.insert('users', {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
