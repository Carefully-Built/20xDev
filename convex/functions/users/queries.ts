import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getOrganizationUser } from '../../lib/organization_user';

export const getById = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByWorkosId = query({
  args: { workosId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

export const listByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return null;
    }

    return await ctx.db
      .query('users')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
  },
});

export const getCurrentByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return getOrganizationUser(ctx, args.organizationId);
  },
});
