# Tasks -- Issue #11: feat: Feature Requests (Featurebase)

## Architecture Context

See `spec.md` Architecture Analysis for interfaces, data flow, error handling, and test requirements.

---

## Tasks

- [x] **Task 1: Create `.env.example` with Featurebase env var**
  - File: `.env.example` (CREATE)
  - This project has no `.env.example` yet. Create it with all public env vars needed:
    ```env
    # Featurebase
    NEXT_PUBLIC_FEATUREBASE_ORG=your-org-name
    ```
  - Criterion: `grep "NEXT_PUBLIC_FEATUREBASE_ORG" .env.example` returns 1 match

- [x] **Task 2: Create Featurebase type declarations and helpers**
  - File: `src/lib/featurebase.ts` (CREATE)
  - Pattern: similar to `src/lib/workos.ts` (utility module with env var + exports)
  - Add TypeScript type declarations for `window.Featurebase`:
    ```ts
    export const FEATUREBASE_ORG = process.env.NEXT_PUBLIC_FEATUREBASE_ORG ?? "";

    export interface FeaturebaseWidgetConfig {
      organization: string;
      theme: "light" | "dark";
      placement?: "right" | "left";
      email?: string;
      defaultBoard?: string;
      locale?: string;
      metadata?: Record<string, string>;
    }

    export interface FeaturebaseIdentifyConfig {
      organization: string;
      email: string;
      name: string;
      userId?: string;
      profilePicture?: string;
    }

    export type FeaturebaseFunction = {
      (action: "initialize_feedback_widget", config: FeaturebaseWidgetConfig): void;
      (action: "identify", config: FeaturebaseIdentifyConfig, callback?: (err: unknown) => void): void;
      q?: unknown[][];
    };

    declare global {
      interface Window {
        Featurebase: FeaturebaseFunction;
      }
    }

    export function ensureFeaturebase(): void {
      if (typeof window === "undefined") return;
      if (typeof window.Featurebase !== "function") {
        // eslint-disable-next-line func-names -- Featurebase SDK queue pattern
        window.Featurebase = function (...args: unknown[]) {
          (window.Featurebase.q = window.Featurebase.q || []).push(args);
        } as FeaturebaseFunction;
      }
    }
    ```
  - Criterion: `bun run typecheck` passes, `grep "FEATUREBASE_ORG" src/lib/featurebase.ts` returns match

- [x] **Task 3: Create FeaturebaseWidget client component**
  - File: `src/components/featurebase/featurebase-widget.tsx` (CREATE)
  - Create directory: `src/components/featurebase/`
  - Pattern: Client Component with `useEffect` + `next/script`, similar pattern to how `WorkOsWidgets` wraps third-party scripts in `src/providers/index.tsx`
  - Imports:
    ```ts
    "use client";

    import Script from "next/script";
    import { useEffect, useCallback } from "react";
    import { useTheme } from "next-themes";

    import { FEATUREBASE_ORG, ensureFeaturebase } from "@/lib/featurebase";
    ```
  - Component implementation:
    ```tsx
    interface FeaturebaseWidgetProps {
      readonly email?: string;
      readonly name?: string;
      readonly userId?: string;
      readonly profilePicture?: string;
    }

    export function FeaturebaseWidget({
      email,
      name,
      userId,
      profilePicture,
    }: FeaturebaseWidgetProps): React.ReactElement | null {
      const { resolvedTheme } = useTheme();

      const initWidget = useCallback(() => {
        ensureFeaturebase();

        // Identify user if email is available
        if (email) {
          window.Featurebase("identify", {
            organization: FEATUREBASE_ORG,
            email,
            name: name ?? email,
            userId,
            profilePicture,
          }, (err: unknown) => {
            if (err) {
              console.error("Featurebase identification failed:", err);
            }
          });
        }

        // Initialize feedback widget without placement (no floating button)
        // Widget is triggered via data-featurebase-feedback attribute on sidebar nav
        window.Featurebase("initialize_feedback_widget", {
          organization: FEATUREBASE_ORG,
          theme: resolvedTheme === "dark" ? "dark" : "light",
        });
      }, [email, name, userId, profilePicture, resolvedTheme]);

      useEffect(() => {
        // If script is already loaded, initialize immediately
        if (typeof window !== "undefined" && document.getElementById("featurebase-sdk")) {
          initWidget();
        }
      }, [initWidget]);

      if (!FEATUREBASE_ORG) {
        return null;
      }

      return (
        <Script
          id="featurebase-sdk"
          src="https://do.featurebase.app/js/sdk.js"
          strategy="lazyOnload"
          onLoad={initWidget}
        />
      );
    }
    ```
  - Criterion: `bun run typecheck` passes, `grep -r "featurebase" src/components/` returns match

- [x] **Task 4: Add Feedback nav item to AppSidebar**
  - File: `src/app/dashboard/_components/app-sidebar.tsx` (MODIFY)
  - Step 1: Add `MessageSquarePlus` to the lucide-react import (line 3):
    ```ts
    // Before:
    import { LayoutDashboard, ListTodo, Files, Settings, ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react"
    // After:
    import { LayoutDashboard, ListTodo, Files, Settings, ChevronLeft, ChevronRight, LogOut, Menu, X, MessageSquarePlus } from "lucide-react"
    ```
  - Step 2: Add a `feedbackNavItem` constant after `bottomNavItems` (line 62):
    ```ts
    const feedbackNavItem: NavItem = { title: "Feedback", href: "#feedback", icon: MessageSquarePlus }
    ```
  - Step 3: In the `SidebarContent` component, add a Feedback button in the bottom nav section (line 234, inside `<div className="px-2 py-2 space-y-0.5">`), BEFORE the `bottomNavItems.map(...)`. This is a special nav item that uses `data-featurebase-feedback` attribute instead of a regular link:
    ```tsx
    {/* Feedback button - triggers Featurebase widget */}
    {isCollapsed && !isMobile ? (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-featurebase-feedback
            className="flex w-full items-center justify-center rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <MessageSquarePlus className="size-4 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Feedback</TooltipContent>
      </Tooltip>
    ) : (
      <button
        type="button"
        data-featurebase-feedback
        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <MessageSquarePlus className="size-4 shrink-0" />
        {(!isCollapsed || isMobile) && <span>Feedback</span>}
      </button>
    )}
    ```
  - Pattern: follows the same styling pattern as `NavLink` and `MobileNavLink` components (lines 72-129)
  - Criterion: `grep "data-featurebase-feedback" src/app/dashboard/_components/app-sidebar.tsx` returns match

- [x] **Task 5: Integrate FeaturebaseWidget in DashboardShell**
  - File: `src/app/dashboard/_components/dashboard-shell.tsx` (MODIFY)
  - Step 1: Add import after existing imports (line 6):
    ```ts
    import { FeaturebaseWidget } from '@/components/featurebase/featurebase-widget';
    ```
  - Step 2: Add `FeaturebaseWidget` inside the `DashboardShell` return, after `<MainContent>` and before the closing `</div>` (approx line 60):
    ```tsx
    return (
      <UserProvider initialUser={userData}>
        <OrganizationProvider initialOrganizationId={user.organizationId}>
          <SidebarProvider>
            <div className="min-h-screen">
              <AppSidebar />
              <MainContent>{children}</MainContent>
              <FeaturebaseWidget
                email={userData.email}
                name={userData.name}
                userId={userData.id}
                profilePicture={userData.imageUrl}
              />
            </div>
          </SidebarProvider>
        </OrganizationProvider>
      </UserProvider>
    );
    ```
  - Pattern: similar to how `<Toaster>` is placed in root layout (line 47 of `src/app/layout.tsx`) -- portal-like component placed at end of layout
  - Criterion: `grep "FeaturebaseWidget" src/app/dashboard/_components/dashboard-shell.tsx` returns match

- [x] **Task 6: Build verification**
  - Run `bun run typecheck` -- must pass with zero errors
  - Run `bun run lint` -- must pass with zero warnings
  - Run `bun run build` -- must pass (note: `npx convex deploy` in build script may need Convex credentials; `bunx --bun next build` is the key check)
  - Verify: `grep -r "featurebase" src/` returns files in `src/lib/featurebase.ts` and `src/components/featurebase/featurebase-widget.tsx`
  - Verify: `grep "NEXT_PUBLIC_FEATUREBASE_ORG" .env.example` returns match
  - Criterion: all commands exit 0
