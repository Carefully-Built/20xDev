# Spec — Issue #12: feat: About Page

| Field       | Value |
|-------------|-------|
| Issue       | [#12](https://github.com/Carefully-Built/blueprint/issues/12) |
| Labels      | ink, P2 |
| Milestone   | None |
| Assignees   | None |
| Branch      | `feature/12` |

## Context

Blueprint needs a public about page for the landing site that introduces the product/team and builds trust with potential users.

## Spec

- Create an about page at `/about`
- Include sections: mission/vision, team (or solo founder story), values, tech stack overview
- Follow the existing landing page design patterns and layout
- Make fully responsive (mobile-first per design system)
- Add proper metadata (title, description, OG tags) for SEO
- Link to the about page from the main navigation/footer

## AC (Acceptance Criteria)

- [ ] `bun run build` passes
- [ ] Page accessible at `/about` and renders correctly
- [ ] `grep -r "about" src/app/` shows the about page route
- [ ] Page has proper `<title>` and `<meta description>` tags
- [ ] Page is fully responsive — no horizontal scroll on 375px viewport
- [ ] All touch targets are at least 44px on mobile
- [ ] Page is linked from footer navigation
- [ ] Lighthouse accessibility score >= 90

## Files

- `src/app/(landing)/about/page.tsx` — the about page (CREATE)
- `src/components/layout/Footer.tsx` — add about link (MODIFY)

## Out of Scope

- Blog/news section (separate feature)
- Careers page
- Investor/press page

## Technical Notes

- Stack: Next.js 16 + Bun + Tailwind + shadcn/ui
- Server Component (no client interactivity needed)
- Follow typography scale from design system (h1: text-3xl, body: text-sm)
- Dark mode default
- Route group is `(landing)` (NOT `(marketing)` as issue body suggested)
- `landingNav` in `src/config/site.ts` already includes `{ title: 'About', href: '/about' }` — no nav change needed
- Footer `footerLinks` object needs an About entry added to the `product` array
- i18n uses `gt-next` `<T>` component (not `next-intl`)

---

## Requirements

| ID | Category | Description | Verification |
|----|----------|-------------|--------------|
| REQ-001 | functional | About page exists at `/about` route under `(landing)` route group | `ls src/app/(landing)/about/page.tsx` returns file |
| REQ-002 | functional | Page exports `metadata` with `title` containing "About" | `grep 'title.*About' src/app/(landing)/about/page.tsx` finds match |
| REQ-003 | functional | Page exports `metadata` with `description` string | `grep 'description:' src/app/(landing)/about/page.tsx` finds match |
| REQ-004 | functional | Page exports `metadata` with `openGraph` object | `grep -A2 'openGraph' src/app/(landing)/about/page.tsx` finds title and description |
| REQ-005 | functional | Page renders a mission/vision section | `grep -i 'mission\|vision' src/app/(landing)/about/page.tsx` finds matches |
| REQ-006 | functional | Page renders a values section with Lucide icons | `grep 'lucide-react' src/app/(landing)/about/page.tsx` finds icon imports |
| REQ-007 | functional | Page renders a tech stack overview or CTA section | `grep -i 'tech.*stack\|cta\|get.started' src/app/(landing)/about/page.tsx` finds match |
| REQ-008 | functional | Page is a Server Component (no `'use client'`) | `head -1 src/app/(landing)/about/page.tsx` does NOT contain `'use client'` |
| REQ-009 | functional | `bun run build` completes with exit code 0 | `bun run build` succeeds |
| REQ-010 | functional | Footer contains an "About" link pointing to `/about` | `grep -i 'about' src/components/layout/Footer.tsx` finds link |
| REQ-I18N-001 | i18n | All user-visible strings wrapped in `<T>` component from `gt-next` | `grep -c '<T ' src/app/(landing)/about/page.tsx` returns count >= 8 |
| REQ-I18N-002 | i18n | Each `<T>` tag has a unique `id` attribute following `about.*` namespace | `grep 'id="about\.' src/app/(landing)/about/page.tsx` returns unique IDs |
| REQ-A11Y-001 | a11y | Page has exactly one `<h1>` element | `grep -c '<h1' src/app/(landing)/about/page.tsx` returns 1 |
| REQ-A11Y-002 | a11y | Semantic HTML used: `<section>` elements | `grep -c '<section' src/app/(landing)/about/page.tsx` returns >= 3 |
| REQ-UX-001 | ux | Page uses `max-w-7xl mx-auto` container pattern | `grep 'max-w-7xl' src/app/(landing)/about/page.tsx` finds matches |
| REQ-UX-002 | ux | Section spacing uses `py-16` or `py-24` consistent with landing patterns | `grep 'py-16\|py-24' src/app/(landing)/about/page.tsx` finds matches |
| REQ-UX-003 | ux | Mobile-first responsive: grid with `md:` or `lg:` breakpoints | `grep 'md:grid-cols\|lg:grid-cols' src/app/(landing)/about/page.tsx` finds matches |
| REQ-UX-004 | ux | Typography follows design system: h1 `text-3xl font-bold`, h2 `text-2xl font-semibold` | `grep 'text-3xl.*font-bold\|text-2xl.*font-semibold' src/app/(landing)/about/page.tsx` finds matches |

## Architecture Analysis

### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `src/app/(landing)/about/page.tsx` | About page — Server Component with metadata export, sections for mission, values, tech stack overview, and CTA | Like `src/app/(landing)/privacy/page.tsx` for metadata pattern; section layout like `src/app/(landing)/_components/cta-section.tsx:10-34` but without `'use client'` and animations |

### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `src/components/layout/Footer.tsx` | Line 13, inside `footerLinks.product` array | Add `{ label: 'About', href: '/about', id: 'about' }` after the existing Contact entry |

### Interfaces & Signatures

```ts
// src/app/(landing)/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Blueprint',
  description: 'Learn about Blueprint — the production-ready foundation for B2B SaaS. Our mission, values, and the technology behind it.',
  openGraph: {
    title: 'About - Blueprint',
    description: 'Learn about Blueprint — the production-ready foundation for B2B SaaS.',
  },
};

// Value card data structure (local to file)
interface Value {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

const values: readonly Value[] = [/* 4-6 value cards */];

export default function AboutPage(): React.ReactElement;
```

### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `src/app/(landing)/about/page.tsx` | `next` | `Metadata` (type) |
| `src/app/(landing)/about/page.tsx` | `next/link` | `Link` |
| `src/app/(landing)/about/page.tsx` | `gt-next` | `T` |
| `src/app/(landing)/about/page.tsx` | `lucide-react` | `Rocket`, `Heart`, `Zap`, `Shield` (or similar value icons) |
| `src/app/(landing)/about/page.tsx` | `@/components/ui/button` | `Button` |

### Data Flow

```
Static page — no data fetching.
Content is hardcoded JSX with <T> i18n wrappers.
metadata export → Next.js generates <title>, <meta>, OG tags at build time.
Footer footerLinks.product array → Footer component maps to <Link> elements.
```

### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| Page render | N/A — fully static, no async ops | Next.js built-in error boundary via `src/app/error.tsx` |
| Build | TypeScript errors, missing imports | `bun run build` will fail with clear error messages |
| i18n `<T>` | Missing translation key | `gt-next` falls back to English children content |

### Test Requirements

| Test | data-testid | Assertion |
|------|-------------|-----------|
| Build passes | N/A | `bun run build` exits 0 |
| Route exists | N/A | `ls src/app/(landing)/about/page.tsx` returns file |
| Metadata title | N/A | Page source contains `<title>` with "About" |
| Metadata description | N/A | Page source contains `<meta name="description">` |
| OG tags present | N/A | Page source contains `<meta property="og:title">` |
| Footer link | N/A | `grep 'About' src/components/layout/Footer.tsx` finds link |
| Server Component | N/A | `head -1 src/app/(landing)/about/page.tsx` is NOT `'use client'` |
| i18n coverage | N/A | All visible strings wrapped in `<T>` with `about.*` IDs |
| Single h1 | N/A | `grep -c '<h1' src/app/(landing)/about/page.tsx` returns 1 |
| Responsive container | N/A | `grep 'max-w-7xl' src/app/(landing)/about/page.tsx` finds matches |
