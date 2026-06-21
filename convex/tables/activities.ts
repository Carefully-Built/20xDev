import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const activityStatusValidator = v.union(
  v.literal('todo'),
  v.literal('scheduled'),
  v.literal('done'),
  v.literal('cancelled'),
);

export const activityVisibilityValidator = v.union(v.literal('public'), v.literal('private'));

export const activityAssociationValidator = v.object({
  entityId: v.string(),
  entityType: v.union(
    v.literal('contact'),
    v.literal('opportunity'),
    v.literal('document'),
    v.literal('file'),
  ),
  label: v.string(),
  typeLabel: v.string(),
  value: v.string(),
});

export const activitiesTable = defineTable({
  title: v.string(),
  activityTypeId: v.string(),
  activityTypeLabel: v.string(),
  activityTypeColor: v.string(),
  assignedUserId: v.id('users'),
  participantUserIds: v.array(v.id('users')),
  visibility: activityVisibilityValidator,
  associations: v.array(activityAssociationValidator),
  tagIds: v.optional(v.array(v.string())),
  dueAt: v.optional(v.number()),
  startAt: v.optional(v.number()),
  endAt: v.optional(v.number()),
  googleCalendarEventId: v.optional(v.string()),
  description: v.optional(v.string()),
  status: activityStatusValidator,
  organizationId: v.string(),
  createdBy: v.id('users'),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_start', ['organizationId', 'startAt'])
  .index('by_assigned_user', ['organizationId', 'assignedUserId']);

export const activityMutationDataValidator = v.object({
  title: v.optional(v.string()),
  activityTypeId: v.optional(v.string()),
  activityTypeLabel: v.optional(v.string()),
  activityTypeColor: v.optional(v.string()),
  assignedUserId: v.optional(v.id('users')),
  participantUserIds: v.optional(v.array(v.id('users'))),
  visibility: v.optional(activityVisibilityValidator),
  associations: v.optional(v.array(activityAssociationValidator)),
  tagIds: v.optional(v.array(v.string())),
  dueAt: v.optional(v.number()),
  startAt: v.optional(v.number()),
  endAt: v.optional(v.number()),
  googleCalendarEventId: v.optional(v.string()),
  description: v.optional(v.string()),
  status: v.optional(activityStatusValidator),
});
