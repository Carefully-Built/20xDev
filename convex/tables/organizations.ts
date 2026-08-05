import { defineTable } from 'convex/server';
import { v } from 'convex/values';

// ============================================================
// ORGANIZATIONS TABLE
// Stores organization metadata including logos
// WorkOS handles core org data, Convex handles extended data
//
// Per-app environment isolation (defense-in-depth). When several apps are
// built from this template, each gets its own WorkOS environment and its own
// Convex deployment. These two fields record which app owns a row:
//   workosClientId — the WorkOS client_id of the environment that produced this
//                    org. Mutations cross-check it against
//                    process.env.WORKOS_CLIENT_ID before writing, so a webhook
//                    delivered to the wrong deployment can't pollute this one.
//   appSlug        — the app's slug. OPTIONAL extra labelling: set APP_SLUG or
//                    NEXT_PUBLIC_PROJECT_SLUG to have it recorded and enforced
//                    as well. Useful for audit logging and for maintenance
//                    scripts that scan organizations across Convex deployments.
// Both fields are OPTIONAL, so rows created before this guard landed keep
// validating and no backfill is required.
// ============================================================

export const organizationsTable = defineTable({
  // WorkOS organization ID (primary key for lookups)
  workosId: v.string(),

  // Per-app environment isolation (see header).
  workosClientId: v.optional(v.string()),
  appSlug: v.optional(v.string()),

  // Logo stored in Convex file storage
  logoId: v.optional(v.id('_storage')),

  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_workos_id', ['workosId'])
  // Compound index so multi-app maintenance scans can filter by app + workosId.
  .index('by_app_workos', ['appSlug', 'workosId']);

// ============================================================
// VALIDATORS
// ============================================================

export const updateOrganizationValidator = v.object({
  logoId: v.optional(v.id('_storage')),
});
