# Tasks -- Issue #9: feat: Error Tracking (Sentry)

## Architecture Context

See `spec.md` Architecture Analysis for interfaces, data flow, error handling, and test requirements.

---

## Tasks

- [x] **Task 1: Install `@sentry/nextjs` dependency**
  - Run: `bun add @sentry/nextjs`
  - This installs the Sentry SDK for Next.js with client, server, and edge support.
  - Criterion: `grep "@sentry/nextjs" package.json` returns match in `dependencies`

- [x] **Task 2: Create `instrumentation-client.ts` (client-side Sentry init)**
  - File: `instrumentation-client.ts` (CREATE at project root, NOT inside `src/`)
  - This is the new Sentry pattern for Next.js -- replaces the old `sentry.client.config.ts`.
  - Content:
    ```ts
    import * as Sentry from '@sentry/nextjs';

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // No PII collection by default
      sendDefaultPii: false,

      // Performance monitoring: 100% in dev, 10% in production
      tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

      // Disable debug in production
      debug: false,
    });

    export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
    ```
  - NOTE: Session replay and profiling are explicitly out of scope -- do NOT add `replayIntegration` or `feedbackIntegration`.
  - Criterion: file exists at project root, `grep "NEXT_PUBLIC_SENTRY_DSN" instrumentation-client.ts` returns match

- [x] **Task 3: Create `sentry.server.config.ts` (server-side Sentry init)**
  - File: `sentry.server.config.ts` (CREATE at project root)
  - Content:
    ```ts
    import * as Sentry from '@sentry/nextjs';

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // No PII collection by default
      sendDefaultPii: false,

      // Performance monitoring: 100% in dev, 10% in production
      tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

      // Disable debug in production
      debug: false,
    });
    ```
  - Criterion: file exists at project root, `grep "Sentry.init" sentry.server.config.ts` returns match

- [x] **Task 4: Create `sentry.edge.config.ts` (edge runtime Sentry init)**
  - File: `sentry.edge.config.ts` (CREATE at project root)
  - Content:
    ```ts
    import * as Sentry from '@sentry/nextjs';

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // No PII collection by default
      sendDefaultPii: false,

      // Performance monitoring: 100% in dev, 10% in production
      tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

      // Disable debug in production
      debug: false,
    });
    ```
  - Criterion: file exists at project root, `grep "Sentry.init" sentry.edge.config.ts` returns match

- [x] **Task 5: Create `instrumentation.ts` (Next.js instrumentation hook)**
  - File: `instrumentation.ts` (CREATE at project root)
  - This file registers server and edge Sentry configs conditionally via Next.js instrumentation API.
  - Content:
    ```ts
    import * as Sentry from '@sentry/nextjs';

    export async function register(): Promise<void> {
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./sentry.server.config');
      }

      if (process.env.NEXT_RUNTIME === 'edge') {
        await import('./sentry.edge.config');
      }
    }

    export const onRequestError = Sentry.captureRequestError;
    ```
  - Criterion: file exists, `grep "NEXT_RUNTIME" instrumentation.ts` returns matches for both `nodejs` and `edge`

- [x] **Task 6: Wrap `next.config.ts` with `withSentryConfig`**
  - File: `next.config.ts` (MODIFY)
  - Current state (line 1): `import { withGTConfig } from 'gt-next/config';`
  - Current export (line 27): `export default withGTConfig(nextConfig);`
  - Step 1: Add import at top after existing imports:
    ```ts
    import { withSentryConfig } from '@sentry/nextjs';
    ```
  - Step 2: Replace the export to wrap both configs. The `withGTConfig` must be innermost (applied first), then `withSentryConfig` wraps the result:
    ```ts
    export default withSentryConfig(withGTConfig(nextConfig), {
      // Sentry organization and project slugs (from env or hardcoded for template)
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Suppress source map upload logs unless in CI
      silent: !process.env.CI,

      // Auth token for source map upload (build-time only, not exposed to client)
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Upload larger set of source maps for better stack traces
      widenClientFileUpload: true,

      // Route to tunnel Sentry events through to avoid ad blockers
      tunnelRoute: '/monitoring',
    });
    ```
  - Pattern: similar wrapper pattern as existing `withGTConfig` in the same file
  - Criterion: `grep "withSentryConfig" next.config.ts` returns match, `grep "tunnelRoute" next.config.ts` returns `/monitoring`

- [x] **Task 7: Integrate Sentry in `global-error.tsx`**
  - File: `src/app/global-error.tsx` (MODIFY)
  - Current state: component has no Sentry integration, no `useEffect`, just static JSX with `error.digest` display.
  - Step 1: Add imports at top of file (after `'use client';`):
    ```ts
    import * as Sentry from '@sentry/nextjs';
    import { useEffect } from 'react';
    ```
  - Step 2: Add `useEffect` inside the component to capture the error. Change the component from arrow function returning JSX directly to one with a body:
    ```tsx
    const GlobalError = ({ error, reset }: GlobalErrorProps): React.ReactElement => {
      useEffect(() => {
        Sentry.captureException(error);
      }, [error]);

      return (
        <html lang="en">
          <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background font-sans text-foreground">
            <h1 className="text-9xl font-bold opacity-30">500</h1>
            <h2 className="text-2xl font-semibold">Critical Error</h2>
            <p className="max-w-md text-center opacity-70">
              Something went seriously wrong. Please try refreshing the page.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Refresh Page
            </button>
            {error.digest ? (
              <p className="mt-4 text-xs opacity-50">Error ID: {error.digest}</p>
            ) : null}
          </body>
        </html>
      );
    };
    ```
  - Criterion: `grep "captureException" src/app/global-error.tsx` returns match

- [x] **Task 8: Integrate Sentry in `error.tsx`**
  - File: `src/app/error.tsx` (MODIFY)
  - Current state: has `useEffect` that does `console.error('Application error:', error)` (line 14-16). No Sentry import.
  - Step 1: Add import after existing imports (line 4):
    ```ts
    import * as Sentry from '@sentry/nextjs';
    ```
  - Step 2: Add `Sentry.captureException(error)` inside the existing `useEffect` (line 15), before the `console.error`:
    ```ts
    useEffect(() => {
      Sentry.captureException(error);
      console.error('Application error:', error);
    }, [error]);
    ```
  - Pattern: same pattern as `global-error.tsx` Task 7
  - Criterion: `grep "captureException" src/app/error.tsx` returns match

- [x] **Task 9: Update middleware matcher to exclude `/monitoring`**
  - File: `src/middleware.ts` (MODIFY)
  - Current matcher (line 104-106):
    ```ts
    export const config = {
      matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
      ],
    };
    ```
  - Add `monitoring` to the exclusion pattern (after `_next/image`):
    ```ts
    export const config = {
      matcher: [
        '/((?!_next/static|_next/image|monitoring|favicon.ico|.*\\..*|api/webhooks).*)',
      ],
    };
    ```
  - Criterion: `grep "monitoring" src/middleware.ts` returns match in the matcher pattern

- [x] **Task 10: Add Sentry env vars to `.env.example`**
  - File: `.env.example` (MODIFY)
  - Add the following block at the end of the file:
    ```env

    # Sentry — Error tracking and performance monitoring
    # Get your DSN from https://sentry.io → Project Settings → Client Keys
    NEXT_PUBLIC_SENTRY_DSN=
    # Auth token for source map upload (build-time only)
    # Generate at https://sentry.io → Settings → Auth Tokens
    SENTRY_AUTH_TOKEN=
    SENTRY_ORG=
    SENTRY_PROJECT=
    ```
  - Criterion: `grep "NEXT_PUBLIC_SENTRY_DSN" .env.example` returns match, `grep "SENTRY_AUTH_TOKEN" .env.example` returns match

- [x] **Task 11: Build verification**
  - Run `bun run typecheck` -- must pass with zero errors
  - Run `bun run lint` -- must pass with zero warnings
  - Run `bunx --bun next build` -- must pass (skip `npx convex deploy` which needs credentials)
  - Verify all config files exist:
    ```bash
    ls instrumentation-client.ts sentry.server.config.ts sentry.edge.config.ts instrumentation.ts
    ```
  - Verify integration:
    ```bash
    grep -r "@sentry/nextjs" src/app/global-error.tsx src/app/error.tsx
    grep "withSentryConfig" next.config.ts
    grep "tunnelRoute" next.config.ts
    grep "SENTRY" .env.example
    grep "monitoring" src/middleware.ts
    ```
  - Criterion: all commands exit 0, all grep checks return matches
