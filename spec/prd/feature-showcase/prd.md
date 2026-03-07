# PRD: Feature Showcase Sections

## 1. Overview

Add feature showcase sections to the Blueprint landing page that highlight key capabilities and value propositions. Three distinct layout variants (feature grid, feature with image, feature list) provide visual variety and help convert visitors by clearly communicating what the product offers.

## 2. Problem Statement

The current landing page has a single `FeaturesSection` component with a basic 4-card grid. This limits the ability to showcase Blueprint's full value proposition. Visitors need varied visual presentations to stay engaged and understand different aspects of the product.

## 3. Goals

- Provide 3 distinct feature section layout variants for landing pages
- Make all sections data-driven for easy content management
- Ensure full responsiveness with mobile-first approach
- Follow existing codebase patterns (Server Components, Animate UI, gt-next i18n)

## 4. Data Model

N/A — No database changes. Feature data is static configuration stored in `src/config/features.ts`.

### Feature Data Types

```ts
interface FeatureGridItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

interface FeatureWithImageItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
}

interface FeatureListItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}
```

## 5. API

N/A — No API routes. All data is static config.

## 6. Components

### New Components

| Component | Path | Type | Description |
|-----------|------|------|-------------|
| `FeatureGrid` | `src/components/marketing/feature-grid.tsx` | Server (rendered in `'use client'` wrapper for animations) | Icon + title + description cards in responsive grid |
| `FeatureWithImage` | `src/components/marketing/feature-with-image.tsx` | Server (rendered in `'use client'` wrapper for animations) | Alternating image/text rows |
| `FeatureList` | `src/components/marketing/feature-list.tsx` | Server (rendered in `'use client'` wrapper for animations) | Vertical list with icons and checkmarks |

### Modified Components

| Component | Path | Change |
|-----------|------|--------|
| Landing page | `src/app/(landing)/page.tsx` | Replace `FeaturesSection` with new feature showcase sections |

### Component Hierarchy

```
LandingPage
├── HeroSection
├── FeatureGrid (replaces FeaturesSection)
├── FeatureWithImage (new)
├── FeatureList (new)
├── TechStackSection
├── FaqSection
└── CtaSection
```

## 7. Security

N/A — Public landing page with static content only.

## 8. Performance

- All feature data is static (no runtime fetches)
- Images in FeatureWithImage use Next.js `Image` component with proper sizing
- Animations use Animate UI (GPU-accelerated, respects prefers-reduced-motion)

## 9. i18n

- All user-facing strings wrapped in `<T>` from `gt-next`
- Translation IDs follow existing pattern: `featureGrid.*`, `featureWithImage.*`, `featureList.*`

## 10. Testing

- `bun run build` passes
- `grep -r "feature" src/components/marketing/` finds all 3 components
- Visual check: sections render correctly on landing page
- Responsive: no horizontal scroll at 375px

## 11. Rollout

Single PR to `dev` branch. No feature flags needed — static landing page content.

## 12. Open Questions

None — straightforward UI implementation following existing patterns.
