import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const notificationTypeValidator = v.union(v.literal('files'), v.literal('people'));

export const notificationEntityTypeValidator = v.union(v.literal('contact'), v.literal('file'));

export const notificationsTable = defineTable({
  createdAt: v.number(),
  entityId: v.string(),
  entityType: notificationEntityTypeValidator,
  href: v.optional(v.string()),
  message: v.optional(v.string()),
  organizationId: v.string(),
  seenAt: v.optional(v.number()),
  source: v.optional(v.string()),
  title: v.string(),
  type: notificationTypeValidator,
  typeLabel: v.string(),
})
  .index('by_organization_created', ['organizationId', 'createdAt'])
  .index('by_organization_seen', ['organizationId', 'seenAt']);
