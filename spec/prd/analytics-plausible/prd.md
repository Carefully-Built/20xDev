# PRD: Analytics (Plausible)

## 1. Overview

Privacy-friendly analytics integration using Plausible for Blueprint. Tracks page views, user journeys, and conversion events without cookies, fully GDPR-compliant. Uses the `next-plausible` package for seamless Next.js App Router integration.

## 2. Goals

- Track page views across all public and authenticated pages
- Fire custom events on key conversion points (CTA clicks, pricing interactions, signup)
- Zero cookies, zero privacy concerns — GDPR-compliant out of the box
- Production-only loading — no analytics noise in dev/preview
- Lightweight — no impact on Core Web Vitals

## 3. User Stories

- As a **product owner**, I want to see which landing pages drive the most traffic so I can optimize conversion funnels.
- As a **product owner**, I want to track CTA click events so I can measure conversion rates.
- As a **developer**, I want a simple `usePlausible()` hook to fire custom events from any client component.

## 4. Data Model

N/A — Plausible is a third-party SaaS. No Convex schema changes required.

## 5. API / Backend

N/A — No server-side API. Plausible script runs client-side only. Custom events fire via the `plausible()` function injected by the script.

## 6. Components

### PlausibleProvider (wrapper)
- **Location**: Root layout (`src/app/layout.tsx`)
- **Source**: `next-plausible` package (`PlausibleProvider`)
- **Props**: `domain` (from env var), `enabled` (production only), `trackOutboundLinks`
- **Pattern**: Similar to how `IntercomProvider` wraps `(landing)/layout.tsx`, but at root level since analytics should cover all pages

### Analytics helper (`src/lib/analytics.ts`)
- **Purpose**: Centralized custom event definitions and type-safe event helper
- **Exports**: `trackEvent(name, props?)` wrapper, event name constants
- **Events**: `signup`, `cta_click`, `pricing_click`, `contact_submit`, `feature_request`

### Event integration in existing components
- `cta-section.tsx` — fire `cta_click` on "Start Building" button
- `hero-section.tsx` — fire `cta_click` on "Get Started" and `learn_more` on "Learn More"
- `pricing-card.tsx` — fire `pricing_click` with tier name prop

## 7. Security

- No PII collected — Plausible is cookieless and privacy-first
- Script loaded from Plausible CDN (`plausible.io`) — trusted third party
- Environment variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` must not leak internal domain info (it's the public site domain, so safe)

## 8. Performance

- Plausible script is <1KB — negligible impact
- Script loaded with `defer` (handled by `next-plausible` automatically)
- No cookies set, no localStorage usage
- Production-only via `enabled` prop — zero overhead in dev

## 9. i18n

N/A — Analytics is invisible to users. No translatable strings added.

## 10. Testing

- `bun run build` passes with Plausible integration
- `grep -r "plausible" src/` returns integration files
- Browser dev tools: verify script loads on production build
- Browser dev tools: verify custom events fire on CTA clicks
- No cookies set by analytics script

## 11. Rollout

1. Install `next-plausible`
2. Add `PlausibleProvider` to root layout
3. Create analytics helper with custom events
4. Wire events to CTA buttons
5. Add env var to `.env.example`
6. Deploy to preview, verify in Plausible dashboard

## 12. Open Questions

None — straightforward integration with well-documented package.
