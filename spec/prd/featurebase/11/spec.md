# Spec -- Issue #11: feat: Feature Requests (Featurebase)

| Field | Value |
|-------|-------|
| Issue | [#11](https://github.com/Carefully-Built/blueprint/issues/11) |
| Labels | ink, P2 |
| Milestone | -- |
| State | OPEN |
| PRD | `spec/prd/featurebase/prd.md` |

## Context

Blueprint needs a feature request and feedback portal where users can submit, vote on, and track feature requests. Featurebase provides this with a changelog, roadmap, and documentation portal.

## Spec

- Set up Featurebase widget integration
- Add Featurebase feedback widget to the app (accessible from dashboard/navbar)
- Configure SSO so authenticated users are auto-identified
- Add a "Feature Requests" link in the app navigation
- Optionally embed the Featurebase changelog on a public page
- Add environment variable for Featurebase organization ID

## AC (Acceptance Criteria)

- [ ] `bun run build` passes with Featurebase integration
- [ ] Featurebase widget opens when clicking the feedback button
- [ ] `grep -r "featurebase" src/` returns integration files
- [ ] Authenticated users are identified in the widget (no re-login needed)
- [ ] Environment variable `NEXT_PUBLIC_FEATUREBASE_ORG` is documented in `.env.example`
- [ ] Widget loads lazily (not blocking initial page load)

## Files da modificare

- `src/components/featurebase/featurebase-widget.tsx` -- client component for the widget
- `src/app/dashboard/_components/dashboard-shell.tsx` -- include widget in dashboard
- `src/app/dashboard/_components/app-sidebar.tsx` -- add Feedback nav item
- `src/lib/featurebase.ts` -- initialization helpers
- `.env.example` -- add Featurebase env var

## Out of Scope

- Self-hosted Featurebase instance
- Custom feedback forms (use Featurebase built-in)
- Featurebase API integration for syncing with GitHub Issues

## Technical Notes

- Stack: Next.js 16 + Bun
- Featurebase docs: https://docs.featurebase.app/
- Widget is loaded via script tag -- must be Client Component
- SSO integration requires passing JWT with user data
- Consider adding to dashboard layout only (not landing pages)
- Featurebase SDK URL: `https://do.featurebase.app/js/sdk.js`
- Widget init function: `window.Featurebase("initialize_feedback_widget", { ... })`
- User identification via `window.Featurebase("identify", { ... })`
- Custom trigger via `data-featurebase-feedback` attribute on any element

---

## Requirements

| ID | Category | Description | Verification |
|----|----------|-------------|--------------|
| REQ-001 | functional | Featurebase SDK script loads lazily via `next/script` strategy `lazyOnload` | `grep 'lazyOnload' src/components/featurebase/featurebase-widget.tsx` returns match |
| REQ-002 | functional | Featurebase widget initializes with org ID from `NEXT_PUBLIC_FEATUREBASE_ORG` env var | `grep 'NEXT_PUBLIC_FEATUREBASE_ORG' src/components/featurebase/featurebase-widget.tsx` returns match |
| REQ-003 | functional | Widget opens when clicking sidebar "Feedback" nav item via `data-featurebase-feedback` attribute | `grep 'data-featurebase-feedback' src/app/dashboard/_components/app-sidebar.tsx` returns match |
| REQ-004 | functional | Authenticated users are auto-identified in the widget (email, name, userId passed) | `grep 'initialize_feedback_widget' src/components/featurebase/featurebase-widget.tsx` returns match with email/name config |
| REQ-005 | functional | Widget does not render if `NEXT_PUBLIC_FEATUREBASE_ORG` is missing (early return null) | `grep 'return null' src/components/featurebase/featurebase-widget.tsx` returns match |
| REQ-006 | functional | Widget respects app theme (light/dark) via `next-themes` `useTheme` hook | `grep 'useTheme' src/components/featurebase/featurebase-widget.tsx` returns match |
| REQ-007 | functional | No floating button rendered -- widget triggered only via sidebar nav `data-featurebase-feedback` | `grep -v 'placement' src/components/featurebase/featurebase-widget.tsx` confirms no `placement` in widget config (or placement is omitted) |
| REQ-008 | functional | `bun run build` passes with all Featurebase integration files | `bun run build` exits 0 |
| REQ-009 | functional | Featurebase integration files exist in src | `grep -r 'featurebase' src/` returns files in `src/lib/` and `src/components/featurebase/` |
| REQ-010 | functional | "Feedback" nav item appears in sidebar bottom section before "Settings" | Visual: sidebar shows Feedback icon+label above Settings in bottom nav |
| REQ-SEC-001 | security | No PII leaked to client beyond what Featurebase needs (email, name, userId) | `grep -r 'accessToken\|refreshToken\|password' src/components/featurebase/` returns no matches |
| REQ-SEC-002 | security | Widget initialization only happens inside authenticated dashboard (not landing pages) | `FeaturebaseWidget` rendered only in `dashboard-shell.tsx`, not in root `layout.tsx` or `(landing)` |
| REQ-SEC-003 | security | Featurebase org ID is read from env var, not hardcoded | `grep -r 'process.env.NEXT_PUBLIC_FEATUREBASE_ORG' src/lib/featurebase.ts` returns match |
| REQ-I18N-001 | i18n | Widget locale set to `"en"` (primary language) | `grep 'locale' src/components/featurebase/featurebase-widget.tsx` shows `"en"` or locale config |
| REQ-A11Y-001 | a11y | Feedback sidebar nav item has accessible label visible when sidebar is expanded, tooltip when collapsed | Sidebar nav pattern already handles this via `NavLink` component with `Tooltip` for collapsed state |
| REQ-A11Y-002 | a11y | Feedback sidebar nav item has minimum 44px touch target | Existing sidebar nav items use `py-1.5 px-2.5` pattern meeting touch target requirement |
| REQ-UX-001 | ux | Feedback nav item placed in `bottomNavItems` array before Settings | `grep -A2 'bottomNavItems' src/app/dashboard/_components/app-sidebar.tsx` shows Feedback before Settings |
| REQ-UX-002 | ux | Feedback nav item uses `MessageSquarePlus` icon from lucide-react | `grep 'MessageSquarePlus' src/app/dashboard/_components/app-sidebar.tsx` returns match |
| REQ-UX-003 | ux | `.env.example` documents `NEXT_PUBLIC_FEATUREBASE_ORG` with a descriptive comment | `grep 'NEXT_PUBLIC_FEATUREBASE_ORG' .env.example` returns match with comment |

---

## Architecture Analysis

### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `src/lib/featurebase.ts` | TypeScript type declarations for `window.Featurebase`, config constants, org ID export | Like `src/lib/workos.ts` (env var export + type setup) |
| `src/components/featurebase/featurebase-widget.tsx` | Client Component: loads SDK script lazily, initializes widget with user data + theme | Like `src/components/theme-toggle.tsx` (client component using `useTheme`) |
| `.env.example` | Documents required environment variables including Featurebase org | New file |

### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `src/app/dashboard/_components/app-sidebar.tsx` | Line 3 (imports) | Add `MessageSquarePlus` to lucide-react import |
| `src/app/dashboard/_components/app-sidebar.tsx` | Lines 60-62 (`bottomNavItems` array) | Insert `{ title: "Feedback", href: "#", icon: MessageSquarePlus }` before Settings, add `data-featurebase-feedback` attribute handling |
| `src/app/dashboard/_components/app-sidebar.tsx` | `NavLink` component (lines 72-103) | Add support for `dataAttributes` prop on NavItem to pass `data-featurebase-feedback` to the element |
| `src/app/dashboard/_components/app-sidebar.tsx` | `MobileNavLink` component (lines 112-129) | Same `dataAttributes` support for mobile nav |
| `src/app/dashboard/_components/dashboard-shell.tsx` | Line 1-6 (imports) | Add import of `FeaturebaseWidget` |
| `src/app/dashboard/_components/dashboard-shell.tsx` | Lines 51-62 (DashboardShell return) | Render `<FeaturebaseWidget>` inside the provider tree, passing user email/name/userId/profilePicture |

### Interfaces & Signatures

```ts
// src/lib/featurebase.ts
export const FEATUREBASE_ORG: string | undefined; // process.env.NEXT_PUBLIC_FEATUREBASE_ORG

interface FeaturebaseWidgetConfig {
  organization: string;
  theme: "light" | "dark";
  placement?: "right" | "left";
  email?: string;
  defaultBoard?: string;
  locale?: string;
  metadata?: Record<string, string> | null;
}

type FeaturebaseCallback = (
  err: unknown,
  data?: { action: "widgetReady" | "widgetOpened" | "feedbackSubmitted" }
) => void;

type FeaturebaseFunction = {
  (action: "initialize_feedback_widget", config: FeaturebaseWidgetConfig, callback?: FeaturebaseCallback): void;
  q?: unknown[][];
};

declare global {
  interface Window {
    Featurebase: FeaturebaseFunction;
  }
}

// src/components/featurebase/featurebase-widget.tsx
interface FeaturebaseWidgetProps {
  readonly email?: string;
  readonly name?: string;
  readonly userId?: string;
  readonly profilePicture?: string;
}

export function FeaturebaseWidget(props: FeaturebaseWidgetProps): React.ReactElement | null;

// Updated NavItem interface in app-sidebar.tsx
interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  dataAttributes?: Record<string, string>; // e.g. { "data-featurebase-feedback": "" }
  isButton?: boolean; // true = renders as button instead of Link (for non-navigation items)
}
```

### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `src/components/featurebase/featurebase-widget.tsx` | `react` | `useEffect`, `useCallback` |
| `src/components/featurebase/featurebase-widget.tsx` | `next/script` | `Script` |
| `src/components/featurebase/featurebase-widget.tsx` | `next-themes` | `useTheme` |
| `src/components/featurebase/featurebase-widget.tsx` | `@/lib/featurebase` | `FEATUREBASE_ORG` (+ type side-effects) |
| `src/app/dashboard/_components/dashboard-shell.tsx` | `@/components/featurebase/featurebase-widget` | `FeaturebaseWidget` |
| `src/app/dashboard/_components/app-sidebar.tsx` | `lucide-react` | `MessageSquarePlus` (added to existing import) |

### Data Flow

```
--- Widget Initialization ---
1. Dashboard layout (server) -> getSession() -> user data (id, email, firstName, lastName, profilePictureUrl)
2. DashboardShell receives user as prop -> passes email/name/userId/profilePicture to FeaturebaseWidget
3. FeaturebaseWidget (client) renders <Script src="https://do.featurebase.app/js/sdk.js" strategy="lazyOnload">
4. On script load (onLoad callback):
   a. Calls window.Featurebase("initialize_feedback_widget", {
        organization: FEATUREBASE_ORG,
        theme: resolvedTheme === "dark" ? "dark" : "light",
        email: props.email,
        locale: "en"
      })
5. Widget attaches to DOM, listens for data-featurebase-feedback click events

--- User Interaction ---
6. User clicks "Feedback" in sidebar -> element has data-featurebase-feedback attribute
7. Featurebase SDK intercepts click -> opens feedback widget popup
8. User submits feedback -> handled entirely by Featurebase

--- Theme Changes ---
9. useTheme resolvedTheme changes -> useEffect re-initializes widget with new theme
```

### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| SDK script load | Network error / CDN down | `next/script` `onError` -- log to console, widget simply absent |
| `window.Featurebase` not available | Script blocked by ad-blocker | Guard with `typeof window !== "undefined" && typeof window.Featurebase === "function"` |
| Missing `NEXT_PUBLIC_FEATUREBASE_ORG` | Env var not set | `FeaturebaseWidget` returns `null` early, no script loaded |
| Widget init fails | Invalid org ID | Featurebase handles internally, widget shows error state |
| Theme detection | `resolvedTheme` undefined during SSR | Default to `"dark"` (project default theme) |

### Test Requirements

| Test | data-testid | Assertion |
|------|-------------|-----------|
| Build passes | n/a | `bun run build` exits 0 |
| Integration files exist | n/a | `grep -r "featurebase" src/` returns matches in `src/lib/featurebase.ts` and `src/components/featurebase/featurebase-widget.tsx` |
| Env var documented | n/a | `grep "NEXT_PUBLIC_FEATUREBASE_ORG" .env.example` returns match |
| Sidebar has Feedback item | n/a | `grep "data-featurebase-feedback" src/app/dashboard/_components/app-sidebar.tsx` returns match |
| Widget uses lazy loading | n/a | `grep "lazyOnload" src/components/featurebase/featurebase-widget.tsx` returns match |
| No PII leakage | n/a | `grep -r "accessToken\|refreshToken\|password" src/components/featurebase/` returns no matches |
| Theme-aware | n/a | `grep "useTheme\|resolvedTheme" src/components/featurebase/featurebase-widget.tsx` returns matches |
