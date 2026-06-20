import { defineTable } from 'convex/server';
import { v } from 'convex/values';

// ============================================================
// FILES TABLE
// Stores file metadata with Convex storage references
// ============================================================

export const filesTable = defineTable({
  // File info
  name: v.string(),
  storageId: v.id('_storage'),
  
  // Metadata
  mimeType: v.string(),
  size: v.number(), // bytes
  associations: v.optional(
    v.array(
      v.object({
        entityId: v.string(),
        entityType: v.union(v.literal('contact'), v.literal('opportunity')),
        label: v.string(),
        typeLabel: v.string(),
        value: v.string(),
      }),
    ),
  ),
  
  // Ownership
  organizationId: v.string(),
  uploadedBy: v.id('users'),
  
  // Timestamps
  createdAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_uploaded_by', ['uploadedBy'])
  .index('by_created', ['organizationId', 'createdAt'])
  .index('by_mime_type', ['organizationId', 'mimeType']);
