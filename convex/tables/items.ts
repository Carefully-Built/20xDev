import { defineTable } from 'convex/server';
import { v } from 'convex/values';

// ============================================================
// ITEMS TABLE
// ============================================================

export const itemsTable = defineTable({
  // Core
  name: v.string(),
  description: v.optional(v.string()),
  
  // Status
  status: v.union(
    v.literal('draft'),
    v.literal('active'),
    v.literal('archived')
  ),
  priority: v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high')
  ),
  
  // Ownership
  organizationId: v.string(),
  createdBy: v.id('users'),
  assignedTo: v.optional(v.id('users')),
  
  // Dates
  dueDate: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_status', ['organizationId', 'status'])
  .index('by_priority', ['organizationId', 'priority'])
  .index('by_assigned', ['organizationId', 'assignedTo'])
  .index('by_created', ['organizationId', 'createdAt']);

// ============================================================
// VALIDATORS (for use in functions)
// ============================================================

export const itemStatusValidator = v.union(
  v.literal('draft'),
  v.literal('active'),
  v.literal('archived')
);

export const itemPriorityValidator = v.union(
  v.literal('low'),
  v.literal('medium'),
  v.literal('high')
);

export const createItemValidator = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  status: itemStatusValidator,
  priority: itemPriorityValidator,
  organizationId: v.string(),
  assignedTo: v.optional(v.id('users')),
  dueDate: v.optional(v.number()),
});

export const updateItemValidator = v.object({
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  status: v.optional(itemStatusValidator),
  priority: v.optional(itemPriorityValidator),
  assignedTo: v.optional(v.id('users')),
  dueDate: v.optional(v.number()),
});
