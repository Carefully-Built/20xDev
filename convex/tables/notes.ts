import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const notesTable = defineTable({
  title: v.string(),
  body: v.string(),
  associations: v.optional(
    v.array(
      v.object({
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
      }),
    ),
  ),
  visibility: v.union(v.literal('public'), v.literal('private')),
  organizationId: v.string(),
  createdBy: v.id('users'),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_created', ['organizationId', 'createdAt']);

export const createNoteValidator = v.object({
  associations: v.optional(
    v.array(
      v.object({
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
      }),
    ),
  ),
  body: v.string(),
  title: v.string(),
  visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
});

export const updateNoteValidator = v.object({
  associations: v.optional(
    v.array(
      v.object({
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
      }),
    ),
  ),
  body: v.optional(v.string()),
  title: v.optional(v.string()),
  visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
});
