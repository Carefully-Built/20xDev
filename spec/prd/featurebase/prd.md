# PRD: Feature Requests (Featurebase)

## 1. Overview

Integrate Featurebase as the feature request and feedback portal for Blueprint. Users can submit, vote on, and track feature requests via an embedded widget accessible from the dashboard. Authenticated users are auto-identified via JWT SSO so they never need to re-login in the widget.

## 2. Problem Statement

Blueprint currently has no mechanism for users to submit feature requests or provide structured feedback. Without a feedback loop, product teams using Blueprint as a template cannot gather and prioritize user input. Featurebase provides a turnkey solution with voting, roadmap, and changelog capabilities.

## 3. Goals

- Embed Featurebase feedback widget in the dashboard (not landing pages)
- Auto-identify authenticated users via JWT (no re-login)
- Lazy-load the widget script (no impact on initial page load)
- Provide environment-driven configuration for organization ID
- Follow existing codebase patterns (Client Components, lazy loading, TypeScript strict)

## 4. Data Model

N/A -- No database changes. Featurebase is a third-party SaaS; all data lives on their platform.

## 5. API

N/A -- No custom API routes. The Featurebase SDK communicates directly with their servers. JWT generation for SSO uses existing session data from WorkOS AuthKit (available in dashboard layout's server component).

## 6. Components

### New Components

| Component | Path | Type | Description |
|-----------|------|------|-------------|
| `FeaturebaseWidget` | `src/components/featurebase/featurebase-widget.tsx` | Client | Loads Featurebase SDK script and initializes feedback widget with user identification |

### New Libraries

| File | Path | Description |
|------|------|-------------|
| `featurebase.ts` | `src/lib/featurebase.ts` | Featurebase initialization helpers, TypeScript type declarations for `window.Featurebase` |

### Modified Components

| Component | Path | Change |
|-----------|------|--------|
| `DashboardShell` | `src/app/dashboard/_components/dashboard-shell.tsx` | Include `FeaturebaseWidget` with user data for identification |
| `AppSidebar` | `src/app/dashboard/_components/app-sidebar.tsx` | Add "Feedback" nav item in bottom nav (before Settings) |

### Component Hierarchy (dashboard)

```
DashboardShell
├── UserProvider
├── OrganizationProvider
├── SidebarProvider
│   ├── AppSidebar (+ Feedback nav item with data-featurebase-feedback)
│   └── MainContent
└── FeaturebaseWidget (lazy, receives user email + name)
```

## 7. Security

- Featurebase SDK script loaded from `https://do.featurebase.app/js/sdk.js` (trusted third-party)
- User identification passes only email, name, and profile picture -- no tokens or sensitive data exposed client-side
- JWT SSO (optional, out of scope for initial implementation) would require a server-side API route to generate signed tokens
- Organization ID stored as `NEXT_PUBLIC_FEATUREBASE_ORG` environment variable (public, non-secret)

## 8. Performance

- SDK script loaded via Next.js `Script` component with `strategy="lazyOnload"` -- zero impact on LCP/FID
- Widget initialization deferred to after hydration via `useEffect`
- No floating button rendered by default; widget opens only on explicit user action (nav click)

## 9. i18n

N/A -- Featurebase widget handles its own localization via the `locale` parameter. We pass the current locale from the app.

## 10. Testing

- `bun run build` passes with Featurebase integration
- `grep -r "featurebase" src/` returns integration files
- Environment variable `NEXT_PUBLIC_FEATUREBASE_ORG` documented in `.env.example`
- Widget loads lazily (not blocking initial page load)

## 11. Rollout

Single PR to `dev` branch. No feature flags needed. The widget only appears for authenticated users in the dashboard.

## 12. Open Questions

None -- Featurebase provides a well-documented SDK. Initial implementation uses basic user identification (email + name). JWT SSO can be added later if deeper integration is needed.
