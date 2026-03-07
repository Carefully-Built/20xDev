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

## Requirements

| ID | Category | Description | Verification |
|----|----------|-------------|--------------|
| REQ-001 | functional | 3 distinct feature section components exist: `FeatureGrid`, `FeatureWithImage`, `FeatureList` | `ls src/components/marketing/feature-grid.tsx src/components/marketing/feature-with-image.tsx src/components/marketing/feature-list.tsx` returns 3 files |
| REQ-002 | functional | Feature data is externalized in `src/config/features.ts` with typed arrays | `grep -c 'readonly' src/config/features.ts` returns >= 3; `grep 'export const' src/config/features.ts` returns 3 exports |
| REQ-003 | functional | `FeatureGrid` renders 6 icon+title+description cards in responsive grid | `grep 'sm:grid-cols-2 lg:grid-cols-3' src/components/marketing/feature-grid.tsx` finds match |
| REQ-004 | functional | `FeatureWithImage` renders 3 items with alternating image/text layout | `grep 'lg:flex-row-reverse' src/components/marketing/feature-with-image.tsx` finds match |
| REQ-005 | functional | `FeatureList` renders 6 items in icon+text list layout with responsive grid | `grep 'sm:grid-cols-2 lg:grid-cols-3' src/components/marketing/feature-list.tsx` finds match |
| REQ-006 | functional | All 3 sections are integrated into landing page in correct order | `grep -A2 'FeatureGrid' src/app/\(landing\)/page.tsx` shows all 3 components |
| REQ-007 | functional | Old `FeaturesSection` component is removed | `grep -r 'FeaturesSection' src/` returns 0 matches |
| REQ-008 | functional | Each section has header with `<h2>` title and subtitle paragraph | `grep -c '<h2' src/components/marketing/feature-grid.tsx src/components/marketing/feature-with-image.tsx src/components/marketing/feature-list.tsx` returns 1 for each |
| REQ-009 | functional | Icons use Lucide throughout (no emoji) | `grep -c 'lucide-react' src/config/features.ts` >= 1 |
| REQ-010 | functional | `FeatureWithImage` handles missing placeholder images gracefully | `bun run build` passes; component renders fallback bg-muted container |
| REQ-011 | functional | Build passes | `bun run build` exits 0 |
| REQ-012 | functional | Components use Animate UI (`Fade`/`Slide`) for entrance animations | `grep -c 'Fade\|Slide' src/components/marketing/feature-grid.tsx` >= 2 |
| REQ-013 | functional | Feature data arrays use `as const` assertion for immutability | `grep -c 'as const' src/config/features.ts` >= 3 |
| REQ-SEC-001 | security | No user input accepted — components are static render only | No forms, no inputs, no mutations in feature components |
| REQ-SEC-002 | security | External links (if any CTA) use `rel="noopener noreferrer"` | No external links or properly attributed |
| REQ-I18N-001 | i18n | All user-visible strings wrapped in `<T id="...">` from `gt-next` | `grep -c '<T ' src/components/marketing/feature-grid.tsx` >= 3 |
| REQ-I18N-002 | i18n | i18n keys use stable namespace pattern | `grep -oE 'id="feature(Grid\|WithImage\|List)\.' src/components/marketing/feature-*.tsx` returns matches |
| REQ-I18N-003 | i18n | Default English text provided as children of every `<T>` tag | No empty `<T>` tags in any feature component |
| REQ-A11Y-001 | a11y | Feature icons are decorative (inside containers with text labels) | Icons accompanied by visible text |
| REQ-A11Y-002 | a11y | Section headings use semantic HTML with correct hierarchy | h2 for section titles, h3 for item titles |
| REQ-A11Y-003 | a11y | Images in `FeatureWithImage` have descriptive `alt` text | `grep 'alt={' src/components/marketing/feature-with-image.tsx` returns matches |
| REQ-A11Y-004 | a11y | Color contrast meets WCAG AA — uses theme tokens only | No custom color values; only theme tokens |
| REQ-UX-001 | ux | Sections responsive: stack on mobile, grid on desktop | Grid classes use mobile-first breakpoints |
| REQ-UX-002 | ux | Touch targets meet 44px minimum on mobile | Cards have sufficient padding |
| REQ-UX-003 | ux | No horizontal scroll on 375px viewport | Container uses `max-w-7xl px-4` |
| REQ-UX-004 | ux | Section spacing follows design system | `grep 'py-24' src/components/marketing/feature-*.tsx` returns matches |
| REQ-UX-005 | ux | Cards follow design system: rounded, border, hover transition | Card rounding classes present |
| REQ-UX-006 | ux | Dark mode supported via theme tokens | No hardcoded light colors |
| REQ-UX-007 | ux | Landing page section order: Hero -> FeatureGrid -> FeatureWithImage -> FeatureList -> TechStack -> FAQ -> CTA | Page file confirms order |

---

## Architecture Analysis

### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `src/config/features.ts` | Typed feature data arrays (grid, image, list) with `readonly` interfaces and `as const` | Like `src/config/pricing.ts:1-84` -- same `readonly` interface + `as const` array pattern |
| `src/components/marketing/feature-grid.tsx` | 6-card responsive grid section (icon + title + description) | Like `src/app/(landing)/_components/features-section.tsx:1-74` -- same Card + Fade/Slide + `<T>` pattern, but 6 items in 3-col grid |
| `src/components/marketing/feature-with-image.tsx` | Alternating image/text rows (3 items) with section background | Like `src/app/(landing)/_components/tech-stack-section.tsx:260-323` -- same `border-t bg-muted/30` section, `max-w-7xl` container, Fade/Slide |
| `src/components/marketing/feature-list.tsx` | Icon + text list in responsive grid (6 items) | Like `src/components/marketing/pricing-card.tsx:53-71` -- icon + text row pattern, but in a grid layout |

### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `src/app/(landing)/page.tsx` | Lines 1-5 (imports) | Remove `FeaturesSection` import, add `FeatureGrid`, `FeatureWithImage`, `FeatureList` imports from `@/components/marketing/*` |
| `src/app/(landing)/page.tsx` | Lines 19-20 (`<FeaturesSection />`) | Replace with `<FeatureGrid />`, `<FeatureWithImage />`, `<FeatureList />` in sequence |
| `src/app/(landing)/_components/features-section.tsx` | Entire file | DELETE -- replaced by new components |

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

export const featureGridItems: readonly FeatureGridItem[];    // 6 items
export const featureWithImageItems: readonly FeatureWithImageItem[];  // 3 items
export const featureListItems: readonly FeatureListItem[];    // 6 items

// src/components/marketing/feature-grid.tsx
export function FeatureGrid(): React.ReactElement;

// src/components/marketing/feature-with-image.tsx
export function FeatureWithImage(): React.ReactElement;

// src/components/marketing/feature-list.tsx
export function FeatureList(): React.ReactElement;
```

### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `src/config/features.ts` | `lucide-react` | `type LucideIcon`, `Rocket`, `Bot`, `Building2`, `Layers`, `Shield`, `Zap`, `BarChart3`, `Lock`, `Paintbrush`, `CreditCard`, `Globe`, `Database`, `Mail`, `Users`, `Clock` |
| `src/components/marketing/feature-grid.tsx` | `gt-next` | `T` |
| `src/components/marketing/feature-grid.tsx` | `@/components/animate-ui/fade` | `Fade` |
| `src/components/marketing/feature-grid.tsx` | `@/components/animate-ui/slide` | `Slide` |
| `src/components/marketing/feature-grid.tsx` | `@/components/ui/card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription` |
| `src/components/marketing/feature-grid.tsx` | `@/config/features` | `featureGridItems` |
| `src/components/marketing/feature-with-image.tsx` | `gt-next` | `T` |
| `src/components/marketing/feature-with-image.tsx` | `next/image` | `Image` |
| `src/components/marketing/feature-with-image.tsx` | `@/components/animate-ui/fade` | `Fade` |
| `src/components/marketing/feature-with-image.tsx` | `@/components/animate-ui/slide` | `Slide` |
| `src/components/marketing/feature-with-image.tsx` | `@/config/features` | `featureWithImageItems` |
| `src/components/marketing/feature-with-image.tsx` | `@/lib/utils` | `cn` |
| `src/components/marketing/feature-list.tsx` | `gt-next` | `T` |
| `src/components/marketing/feature-list.tsx` | `@/components/animate-ui/fade` | `Fade` |
| `src/components/marketing/feature-list.tsx` | `@/components/animate-ui/slide` | `Slide` |
| `src/components/marketing/feature-list.tsx` | `@/config/features` | `featureListItems` |
| `src/app/(landing)/page.tsx` | `@/components/marketing/feature-grid` | `FeatureGrid` |
| `src/app/(landing)/page.tsx` | `@/components/marketing/feature-with-image` | `FeatureWithImage` |
| `src/app/(landing)/page.tsx` | `@/components/marketing/feature-list` | `FeatureList` |

### Data Flow

```
Static config only -- no runtime data fetching.

src/config/features.ts (3 arrays: featureGridItems, featureWithImageItems, featureListItems)
  |-- featureGridItems --> FeatureGrid component --> renders 6 Card components in grid
  |-- featureWithImageItems --> FeatureWithImage component --> renders 3 image/text rows
  +-- featureListItems --> FeatureList component --> renders 6 icon/text items in grid

src/app/(landing)/page.tsx composes:
  HeroSection --> FeatureGrid --> FeatureWithImage --> FeatureList --> TechStackSection --> FaqSection --> CtaSection
```

### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| Image loading in FeatureWithImage | Image file missing at `/images/features/*.png` | Container has `bg-muted/50` fallback background; Next.js `Image` shows broken image but layout does not break |
| Component render | Invalid icon reference in config | TypeScript catches at compile time (`LucideIcon` type) |
| Build | Missing imports or type errors | `bun run build` fails -- caught in CI |

### Test Requirements

| Test | data-testid | Assertion |
|------|-------------|-----------|
| Feature grid renders | N/A (static content) | `grep -r "feature" src/components/marketing/` returns 3 files |
| Build passes | N/A | `bun run build` exits 0 |
| Type safety | N/A | `bun run typecheck` exits 0 |
| Lint clean | N/A | `bun run lint` exits 0 |
| 3 variants exist | N/A | `ls src/components/marketing/feature-grid.tsx src/components/marketing/feature-with-image.tsx src/components/marketing/feature-list.tsx` returns 3 |
| Old component removed | N/A | `grep -r 'FeaturesSection' src/` returns 0 matches |
| i18n coverage | N/A | `grep -c '<T ' src/components/marketing/feature-grid.tsx src/components/marketing/feature-with-image.tsx src/components/marketing/feature-list.tsx` each >= 3 |
| Responsive grid | N/A | `grep 'sm:grid-cols-2' src/components/marketing/feature-grid.tsx src/components/marketing/feature-list.tsx` returns matches |
| No horizontal scroll | N/A | `grep 'max-w-7xl' src/components/marketing/feature-*.tsx` returns match per file |
