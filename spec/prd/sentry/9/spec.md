# Spec -- Issue #9: feat: Error Tracking (Sentry)

| Field | Value |
|-------|-------|
| Issue | [#9](https://github.com/Carefully-Built/blueprint/issues/9) |
| Labels | ink, P2 |
| Milestone | -- |
| State | OPEN |
| PRD | `spec/prd/sentry/prd.md` |

## Context

Blueprint needs error tracking and performance monitoring to catch and diagnose issues in production. Sentry is the chosen provider, offering comprehensive error reporting for Next.js applications.

## Spec

- Install and configure Sentry SDK for Next.js (`@sentry/nextjs`)
- Set up Sentry initialization for client, server, and edge runtimes
- Configure source maps upload for production builds
- Set up error boundary component for graceful error handling
- Configure performance monitoring (transaction sampling)
- Add environment-based DSN configuration
- Set up Sentry tunnel route to avoid ad-blocker interference (optional)

## AC (Acceptance Criteria)

- [ ] `bun run build` passes with Sentry integration
- [ ] `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` exist
- [ ] `grep -r "@sentry/nextjs" src/` returns integration files
- [ ] Test error is caught and reported to Sentry dashboard
- [ ] Source maps are uploaded on production build
- [ ] Environment variable `SENTRY_DSN` is documented in `.env.example`
- [ ] Error boundary renders fallback UI instead of crashing
- [ ] Sentry does not initialize in development unless explicitly enabled

## Files da modificare

- `package.json` -- add `@sentry/nextjs`
- `next.config.ts` -- wrap with `withSentryConfig`
- `sentry.client.config.ts` -- client-side init
- `sentry.server.config.ts` -- server-side init
- `sentry.edge.config.ts` -- edge runtime init
- `src/app/global-error.tsx` -- Sentry error boundary
- `.env.example` -- add Sentry env vars

## Out of Scope

- Custom Sentry dashboards or alerting rules
- Session replay
- Profiling

## Technical Notes

- Stack: Next.js 16 + Bun
- Sentry Next.js docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Use `withSentryConfig` wrapper in next.config.ts
- Set `sampleRate` to 1.0 in dev, 0.1-0.5 in production
- `tunnelRoute: "/monitoring"` to bypass ad blockers

---

## Requirements

| ID | Category | Description | Verification |
|----|----------|-------------|--------------|
| REQ-001 | functional | `@sentry/nextjs` installed as dependency | `grep "@sentry/nextjs" package.json` returns match |
| REQ-002 | functional | Client-side Sentry init in `instrumentation-client.ts` with DSN from env | `grep "NEXT_PUBLIC_SENTRY_DSN" instrumentation-client.ts` returns match |
| REQ-003 | functional | Server-side Sentry init in `sentry.server.config.ts` | File exists and contains `Sentry.init` |
| REQ-004 | functional | Edge runtime Sentry init in `sentry.edge.config.ts` | File exists and contains `Sentry.init` |
| REQ-005 | functional | `instrumentation.ts` registers server and edge configs conditionally | `grep "NEXT_RUNTIME" instrumentation.ts` returns matches for `nodejs` and `edge` |
| REQ-006 | functional | `next.config.ts` wraps export with `withSentryConfig` | `grep "withSentryConfig" next.config.ts` returns match |
| REQ-007 | functional | `global-error.tsx` captures exceptions to Sentry | `grep "captureException" src/app/global-error.tsx` returns match |
| REQ-008 | functional | `error.tsx` captures exceptions to Sentry | `grep "captureException" src/app/error.tsx` returns match |
| REQ-009 | functional | Tunnel route configured at `/monitoring` | `grep "tunnelRoute" next.config.ts` returns match with `/monitoring` |
| REQ-010 | functional | Source maps upload configured with auth token | `grep "authToken" next.config.ts` returns match |
| REQ-011 | functional | `bun run build` passes | `bun run build` exits 0 (Next.js build step) |
| REQ-SEC-001 | security | `SENTRY_AUTH_TOKEN` not exposed to client (no `NEXT_PUBLIC_` prefix) | `grep "NEXT_PUBLIC_SENTRY_AUTH_TOKEN" .env.example` returns 0 matches |
| REQ-SEC-002 | security | `sendDefaultPii` set to `false` | `grep "sendDefaultPii" instrumentation-client.ts sentry.server.config.ts` shows `false` |
| REQ-ENV-001 | config | `.env.example` documents `NEXT_PUBLIC_SENTRY_DSN` | `grep "NEXT_PUBLIC_SENTRY_DSN" .env.example` returns match |
| REQ-ENV-002 | config | `.env.example` documents `SENTRY_AUTH_TOKEN` | `grep "SENTRY_AUTH_TOKEN" .env.example` returns match |
| REQ-ENV-003 | config | Sentry does not init when DSN is empty/undefined | Guard check in all config files |
| REQ-PERF-001 | performance | Production `tracesSampleRate` set to 0.1 | `grep "tracesSampleRate" instrumentation-client.ts` shows conditional rate |
| REQ-MW-001 | functional | Middleware matcher excludes `/monitoring` tunnel route | `grep "monitoring" src/middleware.ts` returns match in matcher |

---

## Architecture Analysis

### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `instrumentation-client.ts` | Client-side Sentry SDK init (DSN, sample rates, router transition) | Sentry docs standard pattern |
| `sentry.server.config.ts` | Server-side Sentry SDK init | Sentry docs standard pattern |
| `sentry.edge.config.ts` | Edge runtime Sentry SDK init | Sentry docs standard pattern |
| `instrumentation.ts` | Next.js instrumentation hook -- conditionally imports server/edge configs | Sentry docs standard pattern |

### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `next.config.ts` | Lines 1-27 | Add `@sentry/nextjs` import, wrap `withGTConfig(nextConfig)` with `withSentryConfig()` |
| `src/app/global-error.tsx` | Lines 1-33 | Add `import * as Sentry`, add `useEffect` with `Sentry.captureException(error)` |
| `src/app/error.tsx` | Lines 1-38 | Add `import * as Sentry`, add `Sentry.captureException(error)` to existing `useEffect` |
| `.env.example` | End of file | Add `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` |
| `src/middleware.ts` | Line 105 (matcher) | Add `monitoring` to exclusion pattern |
| `package.json` | dependencies | Add `@sentry/nextjs` via `bun add` |

### Interfaces & Signatures

```ts
// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: number,
  sendDefaultPii: false,
});
export const onRouterTransitionStart: typeof Sentry.captureRouterTransitionStart;

// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: number,
  sendDefaultPii: false,
});

// sentry.edge.config.ts
import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: number,
  sendDefaultPii: false,
});

// instrumentation.ts
export async function register(): Promise<void>;
export const onRequestError: typeof Sentry.captureRequestError;
```

### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `instrumentation-client.ts` | `@sentry/nextjs` | `* as Sentry` |
| `sentry.server.config.ts` | `@sentry/nextjs` | `* as Sentry` |
| `sentry.edge.config.ts` | `@sentry/nextjs` | `* as Sentry` |
| `instrumentation.ts` | `@sentry/nextjs` | `* as Sentry` |
| `instrumentation.ts` | `./sentry.server.config` | dynamic import |
| `instrumentation.ts` | `./sentry.edge.config` | dynamic import |
| `next.config.ts` | `@sentry/nextjs` | `withSentryConfig` |
| `src/app/global-error.tsx` | `@sentry/nextjs` | `* as Sentry` |
| `src/app/error.tsx` | `@sentry/nextjs` | `* as Sentry` |

### Data Flow

```
--- Error Capture (Client) ---
1. React error boundary catches render error
2. global-error.tsx / error.tsx useEffect calls Sentry.captureException(error)
3. Sentry SDK serializes error + stack trace
4. SDK sends event to /monitoring tunnel route (bypasses ad blockers)
5. Next.js proxies request to Sentry ingest API
6. Sentry deobfuscates stack trace using uploaded source maps

--- Error Capture (Server) ---
1. Server-side error occurs in route handler / server component
2. instrumentation.ts onRequestError = Sentry.captureRequestError
3. Next.js instrumentation hook automatically captures the error
4. Sentry SDK sends event directly to Sentry API (server-side, no ad blocker concern)

--- Performance Monitoring ---
1. Client: onRouterTransitionStart captures route transitions
2. Server: automatic transaction wrapping by @sentry/nextjs
3. Sample rate controls which transactions are sent (0.1 in prod)

--- Source Maps ---
1. Build time: withSentryConfig uploads source maps via SENTRY_AUTH_TOKEN
2. Source maps are NOT served to clients
3. Sentry uses maps server-side to deobfuscate stack traces
```

### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| Missing DSN | `NEXT_PUBLIC_SENTRY_DSN` not set | Sentry SDK no-ops silently -- all `captureException` calls are ignored |
| Missing auth token | `SENTRY_AUTH_TOKEN` not set | Source map upload fails at build time -- build still succeeds, just no deobfuscation |
| Tunnel route blocked | `/monitoring` path conflict | Unlikely -- path is reserved by `withSentryConfig` |
| SDK load failure | Network/bundling error | Error boundaries still render fallback UI, just without Sentry reporting |
| Ad blocker bypass | Tunnel route handles this | Events proxied through app domain |

### Test Requirements

| Test | Assertion |
|------|-----------|
| Build passes | `bun run build` exits 0 (Next.js build step -- Convex deploy may need credentials) |
| Config files exist | `ls instrumentation-client.ts sentry.server.config.ts sentry.edge.config.ts instrumentation.ts` all exist |
| Integration in error files | `grep -r "@sentry/nextjs" src/app/global-error.tsx src/app/error.tsx` returns matches |
| Env vars documented | `grep "SENTRY" .env.example` returns matches for DSN, AUTH_TOKEN, ORG, PROJECT |
| withSentryConfig applied | `grep "withSentryConfig" next.config.ts` returns match |
| Tunnel route configured | `grep "tunnelRoute" next.config.ts` returns `/monitoring` |
| Middleware updated | `grep "monitoring" src/middleware.ts` returns match in matcher |
| No PII by default | `grep "sendDefaultPii" instrumentation-client.ts` shows `false` |
