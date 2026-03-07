# Tasks -- Issue #10: feat: Customer Support (Intercom)

**Branch**: `feature/10`
**Dependency order**: lib helpers -> provider component -> layout integration -> env config -> verification

---

## Architecture Context

See `spec.md` Architecture Analysis for interfaces, import map, data flow, and error handling.

---

- [x] **Task 1: Create Intercom helper library**
  - File: `src/lib/intercom.ts` (CREATE)
  - Pattern: copy structure from `src/lib/web3forms.ts` (thin wrapper around external API)
  - Operation: Create a TypeScript module that wraps `window.Intercom` calls
  - Steps:
    1. Add global type augmentation for `window.Intercom` and `window.intercomSettings`:
       ```ts
       interface IntercomSettings {
         app_id: string;
         name?: string;
         email?: string;
         user_id?: string;
         created_at?: number;
         alignment?: 'left' | 'right';
         horizontal_padding?: number;
         vertical_padding?: number;
         background_color?: string;
         action_color?: string;
       }

       declare global {
         interface Window {
           Intercom?: (...args: unknown[]) => void;
           intercomSettings?: IntercomSettings;
         }
       }
       ```
    2. Create `getIntercomAppId()` function:
       ```ts
       export function getIntercomAppId(): string | undefined {
         // eslint-disable-next-line @typescript-eslint/dot-notation
         return process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] || undefined;
       }
       ```
    3. Create `loadIntercomScript(appId: string)` function that injects the Intercom snippet:
       ```ts
       export function loadIntercomScript(appId: string): void {
         if (typeof window === 'undefined') return;
         if (document.getElementById('intercom-script')) return;

         const script = document.createElement('script');
         script.id = 'intercom-script';
         script.async = true;
         script.src = `https://widget.intercom.io/widget/${appId}`;
         document.head.appendChild(script);

         // Initialize the Intercom command queue
         window.Intercom =
           window.Intercom ??
           function intercomQueue(...args: unknown[]) {
             (intercomQueue as unknown as { q: unknown[][] }).q =
               (intercomQueue as unknown as { q: unknown[][] }).q ?? [];
             (intercomQueue as unknown as { q: unknown[][] }).q.push(args);
           };
       }
       ```
    4. Create `bootIntercom(settings?)` function:
       ```ts
       export function bootIntercom(
         settings?: Partial<Omit<IntercomSettings, 'app_id'>>,
       ): void {
         const appId = getIntercomAppId();
         if (typeof window === 'undefined' || !appId || !window.Intercom) return;

         window.Intercom('boot', {
           app_id: appId,
           alignment: 'right',
           horizontal_padding: 20,
           vertical_padding: 20,
           ...settings,
         });
       }
       ```
    5. Create `updateIntercom(settings)` function:
       ```ts
       export function updateIntercom(
         settings: Partial<Omit<IntercomSettings, 'app_id'>>,
       ): void {
         if (typeof window === 'undefined' || !window.Intercom) return;
         window.Intercom('update', settings);
       }
       ```
    6. Create `shutdownIntercom()` function:
       ```ts
       export function shutdownIntercom(): void {
         if (typeof window === 'undefined' || !window.Intercom) return;
         window.Intercom('shutdown');
       }
       ```
  - Exports: `getIntercomAppId`, `loadIntercomScript`, `bootIntercom`, `updateIntercom`, `shutdownIntercom`, `IntercomSettings` (type)
  - Criterion: `bun run typecheck` passes, `grep -c "window.Intercom" src/lib/intercom.ts` returns >= 4

- [x] **Task 2: Create IntercomProvider client component**
  - File: `src/components/intercom-provider.tsx` (CREATE)
  - Pattern: copy structure from `src/providers/convex-provider.tsx` (client component with env var check and conditional rendering)
  - Operation: Create a `'use client'` component that loads Intercom script on mount and cleans up on unmount
  - Steps:
    1. Add `'use client'` directive
    2. Import dependencies:
       ```ts
       import { useEffect } from 'react';
       import type { ReactNode } from 'react';
       import {
         getIntercomAppId,
         loadIntercomScript,
         bootIntercom,
         shutdownIntercom,
       } from '@/lib/intercom';
       ```
    3. Define the component:
       ```ts
       interface IntercomProviderProps {
         readonly children: ReactNode;
       }

       export function IntercomProvider({
         children,
       }: IntercomProviderProps): React.ReactElement {
         useEffect(() => {
           const appId = getIntercomAppId();
           if (!appId) return;

           loadIntercomScript(appId);

           // Wait for script to load, then boot
           const handleLoad = (): void => {
             bootIntercom();
           };

           const script = document.getElementById('intercom-script');
           if (script) {
             script.addEventListener('load', handleLoad);
           }

           // If Intercom is already available (script cached), boot immediately
           if (window.Intercom) {
             bootIntercom();
           }

           return () => {
             shutdownIntercom();
             if (script) {
               script.removeEventListener('load', handleLoad);
             }
           };
         }, []);

         return <>{children}</>;
       }
       ```
  - Criterion: `bun run typecheck` passes, `grep "'use client'" src/components/intercom-provider.tsx` returns a match

- [x] **Task 3: Add IntercomProvider to landing layout**
  - File: `src/app/(landing)/layout.tsx` (MODIFY)
  - Pattern: existing layout wraps children with `<PageLayout>` and `<LandingLayoutClient>`
  - Operation: Import and wrap content with `<IntercomProvider>`
  - Steps:
    1. Add import after existing imports:
       ```ts
       import { IntercomProvider } from '@/components/intercom-provider';
       ```
    2. Wrap the return JSX -- add `<IntercomProvider>` inside `<PageLayout>`, wrapping `<LandingLayoutClient>`:
       ```tsx
       export default function LandingLayout({ children }: LayoutProps): React.ReactElement {
         return (
           <PageLayout>
             <IntercomProvider>
               <LandingLayoutClient>{children}</LandingLayoutClient>
             </IntercomProvider>
           </PageLayout>
         );
       }
       ```
  - Criterion: `bun run build` passes, `grep "IntercomProvider" src/app/\(landing\)/layout.tsx` returns a match

- [x] **Task 4: Add Intercom env var to .env.example**
  - File: `.env.example` (MODIFY)
  - Pattern: existing env vars have comment header + key=placeholder format (see `NEXT_PUBLIC_WEB3FORMS_KEY`)
  - Operation: Add Intercom App ID entry
  - Steps:
    1. After the Web3Forms section (line 3), add:
       ```

       # Intercom — Customer support chat widget
       # Get your App ID at https://app.intercom.com/a/apps/_/settings/identity-verification/web
       NEXT_PUBLIC_INTERCOM_APP_ID=
       ```
  - Criterion: `grep "INTERCOM" .env.example` returns the variable name

- [x] **Task 5: Verify build and lint**
  - Operation: Run full verification suite
  - Steps:
    1. Run `bun run typecheck` -- must pass with zero errors
    2. Run `bun run lint` -- must pass with zero warnings
    3. Run `bun run build` -- must succeed (note: Convex deploy may be skipped in CI; `bunx --bun next build` is the key check)
    4. Run `grep -r "intercom" src/` -- must return `src/lib/intercom.ts` and `src/components/intercom-provider.tsx` and `src/app/(landing)/layout.tsx`
    5. Run `grep "INTERCOM" .env.example` -- must return the env var
  - Criterion: All 5 checks pass with expected output
