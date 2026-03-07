# PRD: Error Tracking (Sentry)

## 1. Overview

Integrate Sentry error tracking and performance monitoring into Blueprint. Provides comprehensive error reporting across client, server, and edge runtimes, source map uploads for production builds, and graceful error boundary handling.

## 2. Problem Statement

Blueprint has no error tracking or performance monitoring in production. Errors go unnoticed unless users report them. Console errors and server-side exceptions are lost. Sentry provides real-time error reporting, performance tracing, and source map deobfuscation for Next.js applications.

## 3. Goals

- Install `@sentry/nextjs` and configure for all three runtimes (client, server, edge)
- Upload source maps on production builds for readable stack traces
- Provide environment-based DSN configuration (disabled in dev by default)
- Add tunnel route `/monitoring` to bypass ad-blocker interference
- Integrate with existing `global-error.tsx` and `error.tsx` error boundaries
- Set appropriate sample rates (1.0 dev, 0.1 production)

## 4. Data Model

N/A -- No database changes. Sentry is a third-party SaaS; all data lives on their platform.

## 5. API

### Tunnel Route

Sentry's `tunnelRoute: "/monitoring"` in `withSentryConfig` automatically creates an API route that proxies Sentry events, bypassing ad blockers. No custom API route code needed -- handled by the SDK.

### Instrumentation Hook

`instrumentation.ts` at project root registers server and edge Sentry configs via Next.js instrumentation API. `onRequestError` captures server-side request errors automatically.

## 6. Components

### New Files

| File | Path | Type | Description |
|------|------|------|-------------|
| `instrumentation-client.ts` | root | Config | Client-side Sentry init (DSN, sample rates, router transition capture) |
| `sentry.server.config.ts` | root | Config | Server-side Sentry init (DSN, sample rates) |
| `sentry.edge.config.ts` | root | Config | Edge runtime Sentry init (DSN, sample rates) |
| `instrumentation.ts` | root | Config | Next.js instrumentation hook -- imports server/edge configs conditionally |

### Modified Files

| File | Path | Change |
|------|------|--------|
| `next.config.ts` | root | Wrap export with `withSentryConfig()` |
| `src/app/global-error.tsx` | app | Add `Sentry.captureException(error)` in `useEffect` |
| `src/app/error.tsx` | app | Add `Sentry.captureException(error)` in existing `useEffect` |
| `.env.example` | root | Add `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` |
| `src/middleware.ts` | src | Add `/monitoring` to matcher exclusion pattern |

## 7. Security

- `SENTRY_AUTH_TOKEN` is a secret -- used only at build time for source map upload, never exposed to client
- `NEXT_PUBLIC_SENTRY_DSN` is public by design (Sentry DSNs are meant to be client-visible)
- `tunnelRoute` proxies events through the app's own domain -- no direct Sentry API calls from client
- `sendDefaultPii: false` -- no automatic PII collection (emails, IP addresses)
- Source maps uploaded to Sentry but not served to clients (Sentry strips them)

## 8. Performance

- Client SDK loaded as part of instrumentation-client.ts (tree-shaken by Next.js)
- `tracesSampleRate: 0.1` in production -- only 10% of transactions traced
- Session replay and profiling explicitly out of scope (no additional bundle size)
- Tunnel route adds minimal latency (same-origin proxy)

## 9. i18n

N/A -- Sentry SDK does not have user-facing UI that requires translation.

## 10. Testing

- `bun run build` passes with Sentry integration
- `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation-client.ts`, `instrumentation.ts` exist at project root
- `grep -r "@sentry/nextjs" src/` returns integration in error files
- `NEXT_PUBLIC_SENTRY_DSN` documented in `.env.example`
- Error boundary renders fallback UI and reports to Sentry
- Sentry does not initialize when DSN is empty/undefined

## 11. Rollout

Single PR to `dev` branch. Sentry is dormant until `NEXT_PUBLIC_SENTRY_DSN` is configured. No feature flags needed.

## 12. Open Questions

None -- Sentry provides a well-documented Next.js SDK. Session replay and profiling are explicitly out of scope and can be added later.
