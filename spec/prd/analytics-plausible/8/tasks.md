# Tasks — Issue #8: feat: Analytics (Plausible)

> **Architecture context**: See `spec.md` Architecture Analysis for interfaces, data flow, and error handling.
> **Project conventions**: See `spec/project.md` for stack, patterns, and directory structure.
> **PRD**: See `../prd.md` for full feature design.

---

- [x] **Task 1: Install `next-plausible` package**
  - File: `package.json` (MODIFY via package manager)
  - Run:
    ```bash
    cd /Users/shiftclaw/ShiftClawCo/projects/blueprint/worktrees/ink-8 && bun add next-plausible
    ```
  - Criterion: `grep "next-plausible" package.json` returns a match

- [x] **Task 2: Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to `.env.example`**
  - File: `.env.example` (MODIFY)
  - After the Intercom section (line 33), append:
    ```env

    # Plausible Analytics — Privacy-friendly analytics
    # Set to your site domain registered in Plausible (e.g., example.com)
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
    ```
  - Pattern: follows same format as other env vars in `.env.example` (comment + key)
  - Criterion: `grep "NEXT_PUBLIC_PLAUSIBLE_DOMAIN" .env.example` returns a match

- [x] **Task 3: Create analytics helper `src/lib/analytics.ts`**
  - File: `src/lib/analytics.ts` (CREATE)
  - Pattern: similar structure to `src/lib/intercom.ts` (utility module with typed exports)
  - Content:
    ```ts
    /**
     * Analytics event constants and helpers for Plausible integration.
     *
     * Usage in client components:
     *   import { usePlausible } from 'next-plausible';
     *   import { ANALYTICS_EVENTS } from '@/lib/analytics';
     *   const plausible = usePlausible();
     *   plausible(ANALYTICS_EVENTS.CTA_CLICK, { props: { location: 'hero' } });
     */

    export const ANALYTICS_EVENTS = {
      CTA_CLICK: 'cta_click',
      PRICING_CLICK: 'pricing_click',
      SIGNUP: 'signup',
      CONTACT_SUBMIT: 'contact_submit',
      LEARN_MORE: 'learn_more',
      FEATURE_REQUEST: 'feature_request',
    } as const;

    export type AnalyticsEvent =
      (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

    export interface AnalyticsEventProps {
      readonly [key: string]: string | number | boolean;
    }

    /** Returns true if the Plausible domain env var is configured */
    export function isAnalyticsEnabled(): boolean {
      return Boolean(process.env['NEXT_PUBLIC_PLAUSIBLE_DOMAIN']);
    }
    ```
  - Criterion: `bun run typecheck` passes; `grep "ANALYTICS_EVENTS" src/lib/analytics.ts` returns match

- [x] **Task 4: Add `PlausibleProvider` to root layout**
  - File: `src/app/layout.tsx` (MODIFY)
  - Add import at top (after existing imports, before `'./globals.css'`):
    ```ts
    import PlausibleProvider from 'next-plausible';
    ```
  - Wrap the `<body>` content with `PlausibleProvider`. Place it inside `<body>` wrapping `<GTProvider>`:
    ```tsx
    <body className="min-h-screen bg-background font-sans antialiased">
      <PlausibleProvider
        domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? ''}
        enabled={process.env.NODE_ENV === 'production'}
        trackOutboundLinks
      >
        <GTProvider>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="bottom-right" richColors />
          </Providers>
        </GTProvider>
      </PlausibleProvider>
    </body>
    ```
  - Note: `PlausibleProvider` renders a `<head>` script tag via Next.js `<Script>` — safe in server component layout. The `enabled` prop ensures the script only loads in production builds.
  - Pattern: similar wrapping pattern to `IntercomProvider` in `src/app/(landing)/layout.tsx`
  - Criterion: `bun run build` passes; `grep "PlausibleProvider" src/app/layout.tsx` returns match

- [x] **Task 5: Add event tracking to `cta-section.tsx`**
  - File: `src/app/(landing)/_components/cta-section.tsx` (MODIFY)
  - Already has `'use client'` directive -- no change needed there
  - Add imports:
    ```ts
    import { usePlausible } from 'next-plausible';
    import { ANALYTICS_EVENTS } from '@/lib/analytics';
    ```
  - Inside `CtaSection` function body, add hook call:
    ```ts
    const plausible = usePlausible();
    ```
  - Change the `<Button>` from using `asChild` with `<Link>` to wrapping with an `onClick` handler. Replace the button block (lines 24-26):
    ```tsx
    <Button
      size="lg"
      asChild
      onClick={() =>
        plausible(ANALYTICS_EVENTS.CTA_CLICK, {
          props: { location: 'cta_section' },
        })
      }
    >
      <Link href="/login">
        <T id="landing.startBuilding">Start Building</T>
      </Link>
    </Button>
    ```
  - Note: `onClick` on a `Button` with `asChild` + `<Link>` fires before navigation -- event will be sent.
  - Criterion: `bun run typecheck` passes; `grep "ANALYTICS_EVENTS" src/app/\(landing\)/_components/cta-section.tsx` returns match

- [x] **Task 6: Add event tracking to `hero-section.tsx`**
  - File: `src/app/(landing)/_components/hero-section.tsx` (MODIFY)
  - Already has `'use client'` directive
  - Add imports:
    ```ts
    import { usePlausible } from 'next-plausible';
    import { ANALYTICS_EVENTS } from '@/lib/analytics';
    ```
  - Inside `HeroSection` function body, add hook call:
    ```ts
    const plausible = usePlausible();
    ```
  - Add `onClick` to the "Get Started" button (line 39-41):
    ```tsx
    <Button
      size="lg"
      className="min-w-40"
      asChild
      onClick={() =>
        plausible(ANALYTICS_EVENTS.CTA_CLICK, {
          props: { location: 'hero' },
        })
      }
    >
      <Link href="/login">
        <T id="landing.getStarted">Get Started</T>
      </Link>
    </Button>
    ```
  - Add `onClick` to the "Learn More" button (line 42-44):
    ```tsx
    <Button
      size="lg"
      variant="outline"
      className="min-w-40"
      asChild
      onClick={() =>
        plausible(ANALYTICS_EVENTS.LEARN_MORE, {
          props: { location: 'hero' },
        })
      }
    >
      <Link href="#features">
        <T id="landing.learnMore">Learn More</T>
      </Link>
    </Button>
    ```
  - Criterion: `bun run typecheck` passes; `grep "ANALYTICS_EVENTS" src/app/\(landing\)/_components/hero-section.tsx` returns match

- [x] **Task 7: Add event tracking to `pricing-card.tsx`**
  - File: `src/components/marketing/pricing-card.tsx` (MODIFY)
  - This is currently a **server component** (no `'use client'`). Must convert to client component.
  - Add `'use client';` as the first line
  - Add imports:
    ```ts
    import { usePlausible } from 'next-plausible';
    import { ANALYTICS_EVENTS } from '@/lib/analytics';
    ```
  - Inside `PricingCard` function body, add hook call:
    ```ts
    const plausible = usePlausible();
    ```
  - Add `onClick` to the bottom `<Button>` (lines 73-79):
    ```tsx
    <Button
      size="lg"
      variant={tier.recommended ? 'default' : 'outline'}
      className="w-full"
      asChild
      onClick={() =>
        plausible(ANALYTICS_EVENTS.PRICING_CLICK, {
          props: { tier: tier.name },
        })
      }
    >
      <Link href={tier.ctaHref}>{tier.cta}</Link>
    </Button>
    ```
  - Criterion: `bun run typecheck` passes; `grep "ANALYTICS_EVENTS" src/components/marketing/pricing-card.tsx` returns match

- [x] **Task 8: Verify build and integration**
  - Run: `bun run typecheck && bun run lint`
  - Run: `grep -r "plausible" src/` — must return at least 4 files (`layout.tsx`, `analytics.ts`, `cta-section.tsx`, `hero-section.tsx`, `pricing-card.tsx`)
  - Run: `grep "NEXT_PUBLIC_PLAUSIBLE_DOMAIN" .env.example` — must return match
  - Criterion: All commands succeed with expected output
