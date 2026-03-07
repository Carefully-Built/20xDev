# Spec — Issue #8: feat: Analytics (Plausible)

| Field       | Value                              |
|-------------|------------------------------------|
| Issue       | #8                                 |
| Title       | feat: Analytics (Plausible)        |
| Labels      | ink, P2                            |
| Milestone   | None                               |
| Assignees   | None                               |
| State       | OPEN                               |
| Branch      | `feature/8`                        |
| PRD         | `spec/prd/analytics-plausible/prd.md` |

## Context

Blueprint needs privacy-friendly analytics to track page views, user journeys, and conversion events without compromising user privacy. Plausible is the chosen provider -- lightweight, cookie-free, and GDPR-compliant.

## Spec

- Install and configure Plausible analytics script <!-- REQ-008 -->
- Add the Plausible script tag to the app layout (via next/script) <!-- REQ-009 -->
- Configure custom events for key conversion points (signup, pricing click, CTA click) <!-- REQ-010 -->
- Set up goal tracking for important user actions <!-- REQ-011 -->
- Ensure script only loads in production (not in dev/preview) <!-- REQ-012 -->
- Add environment variable for Plausible domain/site ID <!-- REQ-013 -->

## AC (Acceptance Criteria)

- [ ] `bun run build` passes with Plausible integration <!-- REQ-001 -->
- [ ] Plausible script loads on production builds only <!-- REQ-002 -->
- [ ] `grep -r "plausible" src/` returns script integration files <!-- REQ-003 -->
- [ ] Custom events fire on CTA button clicks (verified via browser dev tools) <!-- REQ-004 -->
- [ ] Environment variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is documented in `.env.example` <!-- REQ-005 -->
- [ ] No cookies are set by the analytics script <!-- REQ-006 -->
- [ ] Script is loaded with `defer` and does not block page rendering <!-- REQ-007 -->

## Files to Modify

- `package.json` -- add `next-plausible`
- `src/app/layout.tsx` -- add PlausibleProvider
- `src/lib/analytics.ts` -- custom event helper functions (CREATE)
- `.env.example` -- add Plausible env var
- `src/app/(landing)/_components/cta-section.tsx` -- add event tracking
- `src/app/(landing)/_components/hero-section.tsx` -- add event tracking
- `src/components/marketing/pricing-card.tsx` -- add event tracking

## Out of Scope

- Self-hosted Plausible instance (use cloud)
- A/B testing integration
- Revenue tracking (Stripe webhooks handle that)

## Technical Notes

- Stack: Next.js 16 + Bun
- Use `next-plausible` package for App Router integration
- Custom events API: `plausible('event_name', { props: {} })`
- Plausible docs: https://plausible.io/docs

---

## Architecture Analysis

### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `src/lib/analytics.ts` | Centralized analytics constants (event names), TypeScript types, and `EventProps` interface | Like `src/lib/featurebase.ts` (constants + types for a third-party integration) |

### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `package.json` | `dependencies` (line ~15) | Add `"next-plausible": "^3.12.4"` |
| `.env.example` | End of file (after line 34) | Add `# Plausible Analytics` comment + `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com` |
| `src/app/layout.tsx` | Import block (lines 1-13), JSX body (lines 37-51) | Import `PlausibleProvider` from `next-plausible`; wrap children inside `<body>` with `<PlausibleProvider domain={...} enabled={process.env.NODE_ENV === 'production'}>` |
| `src/app/(landing)/_components/cta-section.tsx` | Import block (line 1-8), Button JSX (lines 24-26) | Import `usePlausible` + `ANALYTICS_EVENTS`; add `onClick` handler on Button that calls `plausible(ANALYTICS_EVENTS.CTA_CLICK, { props: { location: 'cta_section' } })` |
| `src/app/(landing)/_components/hero-section.tsx` | Import block (lines 1-9), Button JSX (lines 39-44) | Import `usePlausible` + `ANALYTICS_EVENTS`; add `onClick` on "Get Started" button for `cta_click` event; add `onClick` on "Learn More" button for `learn_more` event |
| `src/components/marketing/pricing-card.tsx` | Add `'use client'` directive (line 0), import block (lines 1-9), Button JSX (lines 73-79) | Add `'use client'`; import `usePlausible` + `ANALYTICS_EVENTS`; replace `asChild` Button with wrapper that fires `pricing_click` event with `{ tier: tier.name }` then navigates |
| `src/components/contact-form.tsx` | Import block (lines 1-21), onSubmit success branch (lines 62-64) | Import `usePlausible` + `ANALYTICS_EVENTS`; after `setStatus('success')`, call `plausible(ANALYTICS_EVENTS.CONTACT_SUBMIT)` |

### Interfaces & Signatures

```ts
// src/lib/analytics.ts

/** Plausible custom event name constants */
export const ANALYTICS_EVENTS = {
  CTA_CLICK: 'cta_click',
  PRICING_CLICK: 'pricing_click',
  SIGNUP: 'signup',
  CONTACT_SUBMIT: 'contact_submit',
  LEARN_MORE: 'learn_more',
} as const;

/** Union type of all event name values */
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/** Props passed alongside events — constrained to safe primitive types */ <!-- REQ-SEC-001: no PII in event props -->
export interface EventProps {
  readonly [key: string]: string | number | boolean;
}
```

### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `src/app/layout.tsx` | `next-plausible` | `PlausibleProvider` (default export) |
| `src/app/(landing)/_components/cta-section.tsx` | `next-plausible` | `usePlausible` |
| `src/app/(landing)/_components/cta-section.tsx` | `@/lib/analytics` | `ANALYTICS_EVENTS` |
| `src/app/(landing)/_components/hero-section.tsx` | `next-plausible` | `usePlausible` |
| `src/app/(landing)/_components/hero-section.tsx` | `@/lib/analytics` | `ANALYTICS_EVENTS` |
| `src/components/marketing/pricing-card.tsx` | `next-plausible` | `usePlausible` |
| `src/components/marketing/pricing-card.tsx` | `@/lib/analytics` | `ANALYTICS_EVENTS` |
| `src/components/contact-form.tsx` | `next-plausible` | `usePlausible` |
| `src/components/contact-form.tsx` | `@/lib/analytics` | `ANALYTICS_EVENTS` |

### Data Flow

```
1. Build time: PlausibleProvider reads NEXT_PUBLIC_PLAUSIBLE_DOMAIN env var
2. Runtime (prod only): PlausibleProvider injects <script defer data-domain="..." src="https://plausible.io/js/script.js">
3. User clicks CTA → onClick handler → usePlausible() returns plausible fn → plausible('cta_click', { props: { location: 'hero' } })
4. Plausible client-side JS sends POST beacon to https://plausible.io/api/event
5. No local state, no cookies, no localStorage — fire-and-forget
```

### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` not set | PlausibleProvider renders without script | No crash — provider accepts undefined domain gracefully |
| `usePlausible()` called when script not loaded (dev/preview) | Returns a no-op function | No crash — events silently dropped |
| Network failure on beacon POST | Plausible client ignores failures | No crash — fire-and-forget by design |
| `pricing-card.tsx` converted to client component | Could break if it uses server-only APIs | Verified: component has no server-only imports (no `headers()`, `cookies()`, etc.) |

### Test Requirements

| Test | data-testid | Assertion |
|------|-------------|-----------|
| Build passes | N/A | `bun run build` exits 0 |
| Typecheck passes | N/A | `bun run typecheck` exits 0 |
| Plausible script present in prod DOM | N/A | `document.querySelector('script[data-domain]')` exists in production build |
| CTA click fires event | N/A | Browser network tab shows POST to `plausible.io/api/event` with `name: cta_click` |
| Pricing click fires event | N/A | Browser network tab shows POST with `name: pricing_click` and `props.tier` |
| Contact submit fires event | `contact-submit` | After successful submit, network tab shows `contact_submit` event |
| No cookies set | N/A | `document.cookie` does not contain plausible-related entries |
