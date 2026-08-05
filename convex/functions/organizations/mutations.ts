import { v } from 'convex/values';

import { mutation } from '../../_generated/server';

// Per-app environment isolation guard. The Convex deployment's env vars carry
// the identity of the app it belongs to. Every mutation that touches the
// organizations table calls this BEFORE writing — if a webhook is ever
// delivered to the wrong deployment, the mutation throws instead of silently
// corrupting another app's data.
//
// WORKOS_CLIENT_ID is required (the template already requires it for auth) and
// is the primary isolation key. The app slug is OPTIONAL extra labelling: set
// APP_SLUG or NEXT_PUBLIC_PROJECT_SLUG to have it recorded and enforced too,
// otherwise the slug checks are simply skipped.
function assertOurEnvironment(): { clientId: string; appSlug: string | undefined } {
  const clientId = process.env.WORKOS_CLIENT_ID;
  const appSlug = process.env.NEXT_PUBLIC_PROJECT_SLUG ?? process.env.APP_SLUG;
  if (!clientId) {
    throw new Error(
      'env-isolation invariant: WORKOS_CLIENT_ID env var missing in this Convex deployment',
    );
  }
  return { clientId, appSlug };
}

// Throws when an existing row is tagged as belonging to a different app.
// Checks are presence-guarded on both sides, so rows written before this guard
// landed (and deployments with no app slug configured) are never blocked.
function assertRowBelongsToUs(
  row: { workosClientId?: string; appSlug?: string },
  env: { clientId: string; appSlug: string | undefined },
  action: string,
  workosId: string,
): void {
  if (row.workosClientId && row.workosClientId !== env.clientId) {
    throw new Error(
      `env-isolation invariant: refusing to ${action} org ${workosId} — workosClientId mismatch`,
    );
  }
  if (env.appSlug && row.appSlug && row.appSlug !== env.appSlug) {
    throw new Error(
      `env-isolation invariant: refusing to ${action} org ${workosId} — appSlug mismatch (existing=${row.appSlug}, current=${env.appSlug})`,
    );
  }
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
    const env = assertOurEnvironment();
    const { clientId, appSlug } = env;
    const now = Date.now();

    // Check if organization exists
    const existing = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (existing) {
      // If the existing record was tagged for a different app, refuse to
      // mutate it. Better to fail loudly than to silently overwrite.
      assertRowBelongsToUs(existing, env, 'mutate', args.workosId);

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
        ...(appSlug && !existing.appSlug ? { appSlug } : {}),
      });

      return existing._id;
    }

    // Create new organization record — populate env-isolation fields.
    const id = await ctx.db.insert('organizations', {
      workosId: args.workosId,
      workosClientId: clientId,
      ...(appSlug ? { appSlug } : {}),
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
    const env = assertOurEnvironment();
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (!org?.logoId) {
      return false;
    }

    // Refuse to delete data tagged for another app.
    assertRowBelongsToUs(org, env, 'delete the logo of', args.workosId);

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
