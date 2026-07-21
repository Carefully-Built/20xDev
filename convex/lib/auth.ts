/**
 * Convex auth guards
 *
 * Server-side authorization helpers for authenticated queries and mutations.
 * Every mutation that reads or writes tenant data MUST authenticate the caller
 * with these guards — a mutation without a guard is publicly callable and can
 * be invoked directly against the Convex API, bypassing any UI check.
 *
 * Identity resolution relies on `convex/auth.config.ts` wiring the WorkOS
 * AuthKit JWT providers; `identity.subject` is the caller's WorkOS user id,
 * which maps to `users.workosId`.
 *
 * @module convex/lib/auth
 */
import type { Doc } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

type AuthCtx = QueryCtx | MutationCtx;

/**
 * Returns the authenticated caller's `users` row, or throws.
 *
 * Throws when the request carries no valid identity (unauthenticated) or when
 * the authenticated identity has no provisioned `users` row yet.
 */
export async function requireUser(ctx: AuthCtx): Promise<Doc<'users'>> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthorized: authentication required');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_workos_id', (q) => q.eq('workosId', identity.subject))
    .first();

  if (!user) {
    throw new Error('Unauthorized: user not provisioned');
  }

  return user;
}

/**
 * Returns the authenticated caller's `users` row, requiring the `admin` role.
 * Use for privileged operations such as managing other users.
 */
export async function requireOrgAdmin(ctx: AuthCtx): Promise<Doc<'users'>> {
  const user = await requireUser(ctx);
  if (user.role !== 'admin') {
    throw new Error('Forbidden: admin role required');
  }
  return user;
}

/**
 * Ensures `caller` may act on data belonging to `organizationId`.
 *
 * Throws when the caller has no organization or when the target organization
 * differs from the caller's — the tenant-isolation boundary. Gates on the
 * application `organizationId`, never on a WorkOS native role.
 */
export function requireSameOrg(caller: Doc<'users'>, organizationId: string | undefined): void {
  if (caller.organizationId === undefined || caller.organizationId !== organizationId) {
    throw new Error('Forbidden: cross-organization access denied');
  }
}
