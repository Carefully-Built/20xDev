# Spec — Issue #14: Feature Showcase Sections (Landing Page)

| Field | Value |
|-------|-------|
| Issue | [#14](https://github.com/Carefully-Built/blueprint/issues/14) |
| Labels | ink, P2 |
| Milestone | None |
| State | OPEN |
| PRD | `spec/prd/feature-showcase/prd.md` |

## Context

The landing page needs feature showcase sections that highlight Blueprint key capabilities and value propositions. These sections help convert visitors by clearly communicating what the product offers.

## Spec

- Create reusable feature section components for the landing page
- Implement at least 3 layout variants:
  1. Feature grid (icon + title + description cards)
  2. Feature with image/screenshot (alternating left/right)
  3. Feature list with checkmarks or icons
- Each section should support: icon (Lucide), title, description, optional CTA
- Make sections data-driven (array of feature objects, not hardcoded)
- Fully responsive with mobile-first approach
- Support dark mode

## AC (Acceptance Criteria)

- [ ] `bun run build` passes
- [ ] At least 3 distinct feature section variants exist
- [ ] `grep -r "feature" src/components/marketing/` returns feature section components
- [ ] Sections render correctly on landing page
- [ ] All sections are responsive — stack on mobile, grid on desktop
- [ ] Feature data is externalized (not hardcoded in JSX)
- [ ] Icons use Lucide (no emoji in UI per design system)
- [ ] Touch targets meet 44px minimum on mobile
- [ ] No horizontal scroll on 375px viewport

## Files da modificare

- `src/components/marketing/feature-grid.tsx` — grid layout variant
- `src/components/marketing/feature-with-image.tsx` — image + text variant
- `src/components/marketing/feature-list.tsx` — list variant
- `src/config/features.ts` — feature data (titles, descriptions, icons)
- `src/app/(landing)/page.tsx` — integrate sections on landing page

## Out of Scope

- Animated feature sections (covered by Animate UI issue)
- Interactive demos or embedded videos
- Pricing comparison (separate pricing page issue)

## Technical Notes

- Stack: Next.js 16 + Bun + Tailwind + shadcn/ui + Lucide icons
- Server Components (no interactivity needed)
- Follow spacing scale: section gaps 2xl (48px), card padding md (16px)
- Cards: rounded-lg, border, shadow-sm, hover:shadow-md
- Typography: h2 for section titles, text-sm for body

---

## Architecture Analysis

### Files to Create

1. `src/config/features.ts` — Feature data arrays for all 3 section variants
2. `src/components/marketing/feature-grid.tsx` — Grid layout component (icon + title + description cards)
3. `src/components/marketing/feature-with-image.tsx` — Alternating image/text layout component
4. `src/components/marketing/feature-list.tsx` — Vertical list layout component with icons

### Files to Modify

1. `src/app/(landing)/page.tsx` — Replace `FeaturesSection` import/usage with new components
2. `src/app/(landing)/_components/features-section.tsx` — Can be removed (replaced by new components)

### Interfaces & Signatures

```ts
// src/config/features.ts
import type { LucideIcon } from 'lucide-react';

export interface FeatureGridItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export interface FeatureWithImageItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
}

export interface FeatureListItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export const featureGridItems: readonly FeatureGridItem[];
export const featureWithImageItems: readonly FeatureWithImageItem[];
export const featureListItems: readonly FeatureListItem[];

// src/components/marketing/feature-grid.tsx
export function FeatureGrid(): React.ReactElement;

// src/components/marketing/feature-with-image.tsx
export function FeatureWithImage(): React.ReactElement;

// src/components/marketing/feature-list.tsx
export function FeatureList(): React.ReactElement;
```

### Import Map

| File | Imports |
|------|---------|
| `feature-grid.tsx` | `T` from `gt-next`, `Fade`/`Slide` from `@/components/animate-ui/*`, `Card`/`CardHeader`/`CardTitle`/`CardDescription` from `@/components/ui/card`, `featureGridItems` from `@/config/features` |
| `feature-with-image.tsx` | `T` from `gt-next`, `Fade`/`Slide` from `@/components/animate-ui/*`, `Image` from `next/image`, `featureWithImageItems` from `@/config/features` |
| `feature-list.tsx` | `T` from `gt-next`, `Fade`/`Slide` from `@/components/animate-ui/*`, `featureListItems` from `@/config/features` |
| `page.tsx` | `FeatureGrid` from `@/components/marketing/feature-grid`, `FeatureWithImage` from `@/components/marketing/feature-with-image`, `FeatureList` from `@/components/marketing/feature-list` |

### Data Flow

Static config (`src/config/features.ts`) -> Components render data -> Landing page composes sections. No runtime data fetching, no state management.

### Error Handling

N/A — Static content rendering. No user input, no API calls, no error states needed.

### Test Requirements

- `bun run build` passes (compilation check)
- `grep -r "feature" src/components/marketing/` returns 3 files
- Visual: sections render on landing page at 375px, 768px, 1024px viewports
- No horizontal scroll at 375px
