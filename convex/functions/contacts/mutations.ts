import { v } from 'convex/values';
import { createTimestampFields, updateTimestampFields } from '@carefully-built/convex-crud';

import { mutation } from '../../_generated/server';
import { createContactValidator, updateContactValidator } from '../../tables/contacts';
import { buildContactCreatedNotification } from '../notifications/builders';
import { createNotification } from '../notifications/helpers';
import { requireOrganizationUser } from './auth';
import { getScopedContact } from './helpers';

export const create = mutation({
  args: {
    data: createContactValidator,
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireOrganizationUser(ctx, args.organizationId);
    const now = Date.now();

    const contactId = await ctx.db.insert('contacts', {
      ...args.data,
      createdBy: currentUser._id,
      organizationId: args.organizationId,
      ...createTimestampFields(now),
    });

    await createNotification(
      ctx,
      buildContactCreatedNotification({
        contactId,
        contactName: args.data.name,
        createdAt: now,
        organizationId: args.organizationId,
      }),
    );

    return contactId;
  },
});

export const update = mutation({
  args: {
    data: updateContactValidator,
    id: v.id('contacts'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    await getScopedContact(ctx, args.id, args.organizationId);
    await ctx.db.patch(args.id, { ...args.data, ...updateTimestampFields() });

    return ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: {
    id: v.id('contacts'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    await requireOrganizationUser(ctx, args.organizationId);
    await getScopedContact(ctx, args.id, args.organizationId);
    await ctx.db.delete(args.id);
  },
});
