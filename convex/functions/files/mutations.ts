import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { requireOrganizationUser } from '../../lib/organization_user';
import { buildFileUploadedNotification } from '../notifications/builders';
import { createNotification } from '../notifications/helpers';

/**
 * Generate an upload URL for client-side file upload
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save file metadata after upload
 */
export const saveFile = mutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
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
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireOrganizationUser(ctx, args.organizationId);
    const createdAt = Date.now();
    const fileId = await ctx.db.insert('files', {
      storageId: args.storageId,
      name: args.name,
      mimeType: args.mimeType,
      size: args.size,
      associations: args.associations,
      organizationId: args.organizationId,
      uploadedBy: currentUser._id,
      createdAt,
    });
    const associationLabel = args.associations?.[0]?.label;

    await createNotification(
      ctx,
      buildFileUploadedNotification({
        associationLabel,
        createdAt,
        fileId,
        fileName: args.name,
        organizationId: args.organizationId,
      }),
    );

    return fileId;
  },
});

/**
 * Rename a file
 */
export const rename = mutation({
  args: {
    id: v.id('files'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
    return await ctx.db.get(args.id);
  },
});

/**
 * Delete a file (removes from storage and database)
 */
export const remove = mutation({
  args: { id: v.id('files') },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) throw new Error('File not found');
    
    // Delete from storage
    await ctx.storage.delete(file.storageId);
    
    // Delete from database
    await ctx.db.delete(args.id);
  },
});
