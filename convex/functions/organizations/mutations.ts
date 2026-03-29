import { v } from 'convex/values';

import { mutation } from '../../_generated/server';

// ============================================================
// GENERATE UPLOAD URL
// Creates a URL for uploading a logo to Convex storage
// ============================================================

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// ============================================================
// SAVE LOGO
// Links an uploaded file to an organization
// Creates the organization record if it doesn't exist
// ============================================================

export const saveLogo = mutation({
  args: {
    workosId: v.string(),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if organization exists
    const existing = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (existing) {
      // Delete old logo if exists
      if (existing.logoId) {
        await ctx.storage.delete(existing.logoId);
      }

      // Update with new logo
      await ctx.db.patch(existing._id, {
        logoId: args.storageId,
        updatedAt: now,
      });

      return existing._id;
    }

    // Create new organization record
    const id = await ctx.db.insert('organizations', {
      workosId: args.workosId,
      logoId: args.storageId,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

// ============================================================
// DELETE LOGO
// Removes the logo from an organization
// ============================================================

export const deleteLogo = mutation({
  args: { workosId: v.string() },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (!org?.logoId) {
      return false;
    }

    // Delete from storage
    await ctx.storage.delete(org.logoId);

    // Update organization
    await ctx.db.patch(org._id, {
      logoId: undefined,
      updatedAt: Date.now(),
    });

    return true;
  },
});
