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

- Install and configure Plausible analytics script
- Add the Plausible script tag to the app layout (via next/script)
- Configure custom events for key conversion points (signup, pricing click, CTA click)
- Set up goal tracking for important user actions
- Ensure script only loads in production (not in dev/preview)
- Add environment variable for Plausible domain/site ID

## AC (Acceptance Criteria)

- [ ] `bun run build` passes with Plausible integration
- [ ] Plausible script loads on production builds only
- [ ] `grep -r "plausible" src/` returns script integration files
- [ ] Custom events fire on CTA button clicks (verified via browser dev tools)
- [ ] Environment variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is documented in `.env.example`
- [ ] No cookies are set by the analytics script
- [ ] Script is loaded with `defer` and does not block page rendering

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

| File | Purpose |
|------|---------|
| `src/lib/analytics.ts` | Centralized analytics helper — event name constants, type-safe `trackEvent` wrapper |

### Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `next-plausible` dependency |
| `src/app/layout.tsx` | Wrap children with `PlausibleProvider` from `next-plausible` |
| `.env.example` | Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
| `src/app/(landing)/_components/cta-section.tsx` | Import `usePlausible`, fire `cta_click` event on button |
| `src/app/(landing)/_components/hero-section.tsx` | Import `usePlausible`, fire `cta_click` and `learn_more` events |
| `src/components/marketing/pricing-card.tsx` | Convert to client component, import `usePlausible`, fire `pricing_click` event with tier name |

### Interfaces & Signatures

```ts
// src/lib/analytics.ts
export const ANALYTICS_EVENTS = {
  CTA_CLICK: 'cta_click',
  PRICING_CLICK: 'pricing_click',
  SIGNUP: 'signup',
  CONTACT_SUBMIT: 'contact_submit',
  LEARN_MORE: 'learn_more',
  FEATURE_REQUEST: 'feature_request',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

export interface EventProps {
  readonly [key: string]: string | number | boolean;
}
```

### Import Map

- `next-plausible` -> `PlausibleProvider` (root layout), `usePlausible` (client components)
- `@/lib/analytics` -> `ANALYTICS_EVENTS` (CTA components)

### Data Flow

1. `PlausibleProvider` in root layout injects the Plausible `<script>` tag (production only via `enabled` prop)
2. Client components call `usePlausible()` hook to get the `plausible` function
3. On user interaction (click), `plausible(eventName, { props })` fires a beacon to Plausible cloud
4. No data stored locally -- stateless, cookieless

### Error Handling

- If `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is not set, `PlausibleProvider` renders without the script (no crash)
- `usePlausible()` returns a no-op function when the script is not loaded (safe in dev/preview)
- No try/catch needed -- Plausible's client-side API is fire-and-forget

### Test Requirements

- `bun run build` passes
- `bun run typecheck` passes
- `grep -r "plausible" src/` returns integration files
- Manual verification: browser dev tools shows Plausible script on production build
- Manual verification: network tab shows beacon requests on CTA clicks
