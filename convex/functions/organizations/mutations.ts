import { v } from 'convex/values';

import { mutation } from '../../_generated/server';

// Per-app environment isolation guard. The Convex deployment's env vars carry
// the identity of the app it belongs to (WORKOS_CLIENT_ID plus the app slug).
// Every mutation that touches the organizations table calls this BEFORE
// writing — if a webhook is ever delivered to the wrong deployment, the
// mutation throws instead of silently corrupting another app's data.
function assertOurEnvironment(): { clientId: string; appSlug: string } {
  const clientId = process.env.WORKOS_CLIENT_ID;
  const appSlug = process.env.NEXT_PUBLIC_PROJECT_SLUG ?? process.env.APP_SLUG;
  if (!clientId) {
    throw new Error(
      'env-isolation invariant: WORKOS_CLIENT_ID env var missing in this Convex deployment',
    );
  }
  if (!appSlug) {
    throw new Error(
      'env-isolation invariant: app slug env var missing in this Convex deployment (set APP_SLUG or NEXT_PUBLIC_PROJECT_SLUG)',
    );
  }
  return { clientId, appSlug };
}

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
    const { clientId, appSlug } = assertOurEnvironment();
    const now = Date.now();

    // Check if organization exists
    const existing = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (existing) {
      // If the existing record was tagged for a different app, refuse to
      // mutate it. Better to fail loudly than to silently overwrite.
      if (existing.appSlug && existing.appSlug !== appSlug) {
        throw new Error(
          `env-isolation invariant: refusing to mutate org ${args.workosId} — appSlug mismatch (existing=${existing.appSlug}, current=${appSlug})`,
        );
      }
      // Delete old logo if exists
      if (existing.logoId) {
        await ctx.storage.delete(existing.logoId);
      }

      // Update with new logo + lazily backfill the env-isolation fields when
      // missing (rows created before this guard landed don't have them).
      await ctx.db.patch(existing._id, {
        logoId: args.storageId,
        updatedAt: now,
        ...(existing.workosClientId ? {} : { workosClientId: clientId }),
        ...(existing.appSlug ? {} : { appSlug }),
      });

      return existing._id;
    }

    // Create new organization record — populate env-isolation fields.
    const id = await ctx.db.insert('organizations', {
      workosId: args.workosId,
      workosClientId: clientId,
      appSlug,
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
    const { appSlug } = assertOurEnvironment();
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (!org?.logoId) {
      return false;
    }

    // Refuse to delete data tagged for another app.
    if (org.appSlug && org.appSlug !== appSlug) {
      throw new Error(
        `env-isolation invariant: refusing to delete logo for org ${args.workosId} — appSlug mismatch (existing=${org.appSlug}, current=${appSlug})`,
      );
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
