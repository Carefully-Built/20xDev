import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getOrganizationUser } from '../../lib/organization_user';
import { getScopedNote } from './helpers';

export const getById = query({
  args: {
    id: v.id('notes'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return null;
    }

    return getScopedNote(ctx, args.id, args.organizationId);
  },
});

export const listByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return [];
    }

    return ctx.db
      .query('notes')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .collect();
  },
});
