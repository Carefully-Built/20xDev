import { v } from 'convex/values';
import { createTimestampFields, updateTimestampFields } from '@carefully-built/saas-kit/convex-crud';

import { mutation } from '../../_generated/server';
import { requireOrganizationUser } from '../../lib/organization_user';
import { createNoteValidator, updateNoteValidator } from '../../tables/notes';
import { getScopedNote } from './helpers';

export const create = mutation({
  args: {
    data: createNoteValidator,
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireOrganizationUser(ctx, args.organizationId);
    const now = Date.now();

    return ctx.db.insert('notes', {
      ...args.data,
      visibility: args.data.visibility ?? 'public',
      createdBy: currentUser._id,
      organizationId: args.organizationId,
      ...createTimestampFields(now),
    });
  },
});

export const update = mutation({
  args: {
    data: updateNoteValidator,
    id: v.id('notes'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    await getScopedNote(ctx, args.id, args.organizationId);
    await ctx.db.patch(args.id, { ...args.data, ...updateTimestampFields() });

    return ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id('notes'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    await getScopedNote(ctx, args.id, args.organizationId);
    await ctx.db.delete(args.id);
  },
});
