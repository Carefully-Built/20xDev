import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { getOrganizationUser } from '../../lib/organization_user';
import { contactStatusValidator } from '../../tables/contacts';
import { getScopedContact } from './helpers';

export const getById = query({
  args: {
    id: v.id('contacts'),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return null;
    }

    return getScopedContact(ctx, args.id, args.organizationId);
  },
});

export const listByOrganization = query({
  args: {
    limit: v.optional(v.number()),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return [];
    }

    const contacts = await ctx.db
      .query('contacts')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .collect();

    return args.limit ? contacts.slice(0, args.limit) : contacts;
  },
});

export const listByStatus = query({
  args: {
    organizationId: v.string(),
    status: contactStatusValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return [];
    }

    return ctx.db
      .query('contacts')
      .withIndex('by_status', (q) =>
        q.eq('organizationId', args.organizationId).eq('status', args.status),
      )
      .collect();
  },
});

export const summary = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getOrganizationUser(ctx, args.organizationId);
    if (!currentUser) {
      return {
        customer: 0,
        new: 0,
        proposal: 0,
        qualified: 0,
        total: 0,
        value: 0,
      };
    }

    const contacts = await ctx.db
      .query('contacts')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    return {
      customer: contacts.filter((contact) => contact.status === 'customer').length,
      new: contacts.filter((contact) => contact.status === 'new').length,
      proposal: contacts.filter((contact) => contact.status === 'proposal').length,
      qualified: contacts.filter((contact) => contact.status === 'qualified').length,
      total: contacts.length,
      value: contacts.reduce((total, contact) => total + (contact.value ?? 0), 0),
    };
  },
});
