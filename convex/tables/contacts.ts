import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const contactStatusValidator = v.union(
  v.literal('new'),
  v.literal('qualified'),
  v.literal('proposal'),
  v.literal('customer'),
);

export const contactsTable = defineTable({
  name: v.string(),
  company: v.string(),
  role: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  owner: v.optional(v.string()),
  status: contactStatusValidator,
  value: v.optional(v.number()),
  notes: v.optional(v.string()),
  organizationId: v.string(),
  createdBy: v.id('users'),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_status', ['organizationId', 'status'])
  .index('by_created', ['organizationId', 'createdAt']);

export const createContactValidator = v.object({
  name: v.string(),
  company: v.string(),
  role: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  owner: v.optional(v.string()),
  status: contactStatusValidator,
  value: v.optional(v.number()),
  notes: v.optional(v.string()),
});

export const updateContactValidator = v.object({
  name: v.optional(v.string()),
  company: v.optional(v.string()),
  role: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  owner: v.optional(v.string()),
  status: v.optional(contactStatusValidator),
  value: v.optional(v.number()),
  notes: v.optional(v.string()),
});
