# PRD: About Page

## 1. Overview

A public About page for the Blueprint landing site that introduces the product, team/founder story, values, and tech stack overview. Builds trust and credibility with potential users.

## 2. Problem

Blueprint's landing site lacks an About page. Visitors who want to learn more about the product's mission, the team behind it, or the technical philosophy have no dedicated destination. This reduces trust signals for potential customers evaluating the product.

## 3. Solution

Create a static About page at `/about` within the existing `(landing)` route group. The page includes sections for mission/vision, founder/team story, core values, and a brief tech stack overview. It follows the established landing page patterns (Server Component, responsive, i18n-ready).

## 4. Data Model

N/A — This is a static content page with no database interaction.

## 5. API

N/A — No API endpoints needed. Pure static rendering.

## 6. Components

### Page Component
- `src/app/(landing)/about/page.tsx` — Server Component
  - Exports inline `metadata: Metadata` (title, description, openGraph)
  - Renders sections: Hero/Mission, Story, Values, Tech Stack Overview, CTA

### No extracted sub-components needed
- The About page is a single static page with no interactive elements
- Content sections are simple JSX blocks, not reusable components
- If complexity grows later, sections can be extracted

## 7. Security

N/A — Public static page, no auth required, no user input.

## 8. Performance

- Server Component (zero client JS)
- No images required (text-only content)
- Lighthouse performance score should be near-perfect

## 9. i18n

All user-facing text wrapped in `<T>` components from `gt-next`:
- `about.title` — Page heading
- `about.subtitle` — Page subheading
- `about.mission.title`, `about.mission.description`
- `about.story.title`, `about.story.description`
- `about.values.title`, `about.values.[name].title`, `about.values.[name].description`
- `about.cta.title`, `about.cta.description`

## 10. Testing

- `bun run build` passes
- Page accessible at `/about`
- Proper metadata tags present
- Responsive (no horizontal scroll at 375px)
- Footer contains About link

## 11. Rollout

Single deployment — no feature flags or phased rollout needed.

## 12. Open Questions

None — straightforward static page following established patterns.
