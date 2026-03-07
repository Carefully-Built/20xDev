# Spec -- Issue #10: feat: Customer Support (Intercom)

**Branch**: `feature/10`
**Labels**: ink, P2
**Milestone**: None
**Assignees**: None

---

## Context

Blueprint needs a live chat and customer support widget to provide real-time assistance to users. Intercom is the chosen provider, offering chat widgets, help articles, and customer engagement tools.

## Spec

- Install and configure Intercom widget for Next.js
- Add Intercom script/provider to the app layout
- Configure Intercom to show on public pages (landing, pricing, docs)
- Pass authenticated user data to Intercom when logged in (name, email, plan)
- Configure widget appearance to match the app's dark theme
- Add environment variable for Intercom App ID
- Ensure widget doesn't interfere with existing UI (z-index, positioning)

## AC (Acceptance Criteria)

- [ ] `bun run build` passes with Intercom integration
- [ ] Intercom chat bubble appears on landing pages
- [ ] `grep -r "intercom" src/` returns integration files
- [ ] Authenticated users see their name/email in the Intercom widget
- [ ] Environment variable `NEXT_PUBLIC_INTERCOM_APP_ID` is documented in `.env.example`
- [ ] Widget loads only in production (or when env var is set)
- [ ] Widget does not overlap with other fixed-position elements

## Files da modificare

- `package.json` -- add Intercom SDK if using npm package
- `src/app/layout.tsx` -- add Intercom provider/script
- `src/lib/intercom.ts` -- Intercom initialization and user identification helpers
- `src/components/intercom-provider.tsx` -- client component wrapper
- `.env.example` -- add Intercom env var

## Out of Scope

- Intercom product tours
- Custom bots / automation workflows
- Help center / knowledge base setup
- Intercom on dashboard/app pages (landing only initially)

## Technical Notes

- Stack: Next.js 16 + Bun
- Intercom docs: https://developers.intercom.com/
- Must be a Client Component (uses window.Intercom)
- Use `boot` method with user data for authenticated users
- Consider lazy loading to avoid impacting page performance

---

## Architecture Analysis

#### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `src/lib/intercom.ts` | Type-safe wrapper around `window.Intercom` API: boot, update, shutdown, script loader | Like `src/lib/web3forms.ts:1-42` (env var read pattern, interface-first, exported functions) |
| `src/components/intercom-provider.tsx` | Client Component that loads Intercom script on mount, boots widget, shuts down on unmount | Like `src/app/(landing)/_components/landing-layout-client.tsx:1-15` (client component wrapper pattern) |

#### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `src/app/(landing)/layout.tsx` | Lines 1-13 (full file) | Import `IntercomProvider` from `@/components/intercom-provider`, wrap children with `<IntercomProvider>` after `<LandingLayoutClient>` |
| `.env.example` | After line 26 (end of file) | Add `# Intercom` section with `NEXT_PUBLIC_INTERCOM_APP_ID=` |

#### Interfaces & Signatures

```ts
// src/lib/intercom.ts

interface IntercomSettings {
  app_id: string;
  alignment?: 'left' | 'right';
  horizontal_padding?: number;
  vertical_padding?: number;
  background_color?: string;
  action_color?: string;
  name?: string;
  email?: string;
  user_id?: string;
  created_at?: number;
}

// Augment Window with Intercom types
declare global {
  interface Window {
    Intercom?: (...args: unknown[]) => void;
    intercomSettings?: IntercomSettings;
  }
}

/** Returns NEXT_PUBLIC_INTERCOM_APP_ID or undefined if not set */
function getIntercomAppId(): string | undefined;

/** Injects the Intercom CDN script tag (async, idempotent) */
function loadIntercomScript(appId: string): void;

/** Calls Intercom('boot') with app_id and optional settings */
function bootIntercom(settings?: Partial<Omit<IntercomSettings, 'app_id'>>): void;

/** Calls Intercom('update') with partial settings */
function updateIntercom(settings: Partial<Omit<IntercomSettings, 'app_id'>>): void;

/** Calls Intercom('shutdown') to end session and remove widget */
function shutdownIntercom(): void;
```

```ts
// src/components/intercom-provider.tsx
'use client';

import type { ReactNode } from 'react';

interface IntercomProviderProps {
  readonly children: ReactNode;
}

/** Client component that manages Intercom lifecycle. No-ops if env var is unset. */
function IntercomProvider({ children }: IntercomProviderProps): React.ReactElement;
```

#### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `src/lib/intercom.ts` | (none) | Pure module, no imports -- uses only `window` and `document` globals |
| `src/components/intercom-provider.tsx` | `react` | `useEffect` |
| `src/components/intercom-provider.tsx` | `@/lib/intercom` | `getIntercomAppId`, `loadIntercomScript`, `bootIntercom`, `shutdownIntercom` |
| `src/app/(landing)/layout.tsx` | `@/components/intercom-provider` | `IntercomProvider` |

#### Data Flow

```
--- Intercom Widget Lifecycle ---

1. (landing)/layout.tsx renders <IntercomProvider> wrapping page content
2. IntercomProvider mounts (client-side only)
   -> getIntercomAppId() reads process.env.NEXT_PUBLIC_INTERCOM_APP_ID
   -> if undefined -> render children only, no side effects
   -> if defined -> continue
3. useEffect fires:
   -> loadIntercomScript(appId) checks if script already exists (idempotent)
     -> creates <script async src="https://widget.intercom.io/widget/{appId}">
     -> appends to document.body
   -> bootIntercom({ alignment: 'right', vertical_padding: 20 })
     -> calls window.Intercom('boot', { app_id, ...settings })
     -> widget renders chat bubble in bottom-right
4. User navigates away from (landing) route group:
   -> useEffect cleanup fires
   -> shutdownIntercom() calls window.Intercom('shutdown')
   -> widget is removed from DOM
```

#### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| `getIntercomAppId()` | Env var not set | Returns `undefined`, provider skips all initialization (graceful no-op) |
| `loadIntercomScript()` | CDN unreachable / network error | Script fails to load silently (browser handles); widget simply won't appear; no crash |
| `loadIntercomScript()` | Script already injected (double mount in StrictMode) | Check `document.getElementById('intercom-script')` before creating; idempotent |
| `bootIntercom()` | `window.Intercom` not yet available (script still loading) | Intercom CDN snippet creates a queue -- calls before load are buffered automatically |
| `bootIntercom()` | SSR context (no `window`) | Guard with `typeof window !== 'undefined'`; no-op on server |
| `shutdownIntercom()` | Called when Intercom never loaded | Guard with `window.Intercom` existence check; no-op if undefined |
| `updateIntercom()` | Called with empty settings | Intercom SDK handles gracefully; no error |

#### Requirements

| ID | Category | Description | Verification |
|----|----------|-------------|--------------|
| REQ-001 | functional | Intercom CDN script is injected into the page when `NEXT_PUBLIC_INTERCOM_APP_ID` env var is set | `document.querySelector('script[src*="intercom"]')` returns a script element |
| REQ-002 | functional | `window.Intercom('boot', ...)` is called with the app_id after script loads | `typeof window.Intercom === 'function'` returns true |
| REQ-003 | functional | Intercom chat bubble is visible on all `(landing)` route group pages | Navigate to each page, bubble element is present in DOM |
| REQ-004 | functional | Intercom widget does NOT appear on dashboard pages | Navigate to `/dashboard`, no intercom container |
| REQ-005 | functional | Intercom widget does NOT appear on auth pages | Navigate to auth pages, no intercom container |
| REQ-006 | functional | `shutdownIntercom()` is called on provider unmount | React cleanup effect fires on unmount |
| REQ-007 | functional | When env var is not set, provider renders children only with no script injection | Remove env var, no script injected |
| REQ-008 | functional | `bun run build` passes with Intercom integration | `bun run build` exits 0 |
| REQ-009 | functional | `bun run typecheck` passes | `bun run typecheck` exits 0 |
| REQ-010 | functional | `bun run lint` passes | `bun run lint` exits 0 |
| REQ-011 | functional | Intercom script loads lazily (async, not blocking render) | Script tag has `async` attribute |
| REQ-SEC-001 | security | No Intercom App ID hardcoded in source | `grep -rn 'app_id.*=.*"[a-z0-9]' src/` returns no matches |
| REQ-SEC-002 | security | App ID read from `process.env.NEXT_PUBLIC_INTERCOM_APP_ID` only | Only env var reads, no hardcoded values |
| REQ-SEC-003 | security | All helpers guard against SSR with `typeof window !== 'undefined'` | Window checks present in all functions |
| REQ-SEC-004 | security | No user data passed to Intercom in v1 | No name/email/user_id in boot call |
| REQ-I18N-001 | i18n | No user-facing strings added (Intercom handles own i18n) | No hardcoded text strings |
| REQ-A11Y-001 | a11y | Widget does not break keyboard navigation | Tab order unaffected |
| REQ-A11Y-002 | a11y | Intercom launcher button is keyboard-accessible (SDK) | Focus reachable via Tab |
| REQ-UX-001 | ux | IntercomProvider placed inside `(landing)/layout.tsx` | `grep IntercomProvider src/app/(landing)/layout.tsx` matches |
| REQ-UX-002 | ux | Widget positioned bottom-right with vertical_padding offset from Sonner | `vertical_padding` set to >= 20 |
| REQ-UX-003 | ux | Widget z-index does not conflict with site elements | Intercom default z-index above app z-indices |
| REQ-UX-004 | ux | `NEXT_PUBLIC_INTERCOM_APP_ID` documented in `.env.example` | `grep NEXT_PUBLIC_INTERCOM_APP_ID .env.example` matches |

#### Test Requirements

| Test | data-testid | Assertion |
|------|-------------|-----------|
| Build passes | N/A | `bun run build` exits 0 |
| Typecheck passes | N/A | `bun run typecheck` exits 0 |
| Lint passes | N/A | `bun run lint` exits 0 |
| Files exist | N/A | `grep -r "intercom" src/` returns `src/lib/intercom.ts` and `src/components/intercom-provider.tsx` |
| Env var documented | N/A | `grep "NEXT_PUBLIC_INTERCOM_APP_ID" .env.example` returns match |
| Provider in landing layout | N/A | `grep "IntercomProvider" src/app/\(landing\)/layout.tsx` returns match |
| No hardcoded IDs | N/A | `grep -rn "app_id.*=.*\"[a-z0-9]" src/` returns no matches |
| SSR guards present | N/A | `grep "typeof window" src/lib/intercom.ts` returns matches |
| Script idempotency | N/A | `grep "getElementById.*intercom-script" src/lib/intercom.ts` returns match |
