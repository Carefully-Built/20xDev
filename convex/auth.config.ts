import { authKit } from './auth';

/**
 * Convex auth provider configuration.
 *
 * Wires the WorkOS AuthKit JWT providers so that `ctx.auth.getUserIdentity()`
 * resolves the caller's identity inside queries and mutations. Without this,
 * every authenticated Convex call sees a null identity and the auth guards in
 * `convex/lib/auth.ts` would reject all callers.
 *
 * Requires the same WorkOS env vars already needed by `convex/auth.ts`
 * (WORKOS_CLIENT_ID, WORKOS_API_KEY, WORKOS_WEBHOOK_SECRET).
 */
export default {
  providers: authKit.getAuthConfigProviders(),
};
