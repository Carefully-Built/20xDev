# Tasks — Issue #12: feat: About Page

> **Architecture Context**: Static Server Component page under `(landing)` route group. No database, no API, no client interactivity. Follows privacy/terms page pattern for structure, contact/pricing page pattern for section layout and i18n.

## Assumptions Made

- The About page content uses placeholder/template text since Blueprint is a starter kit — real projects will customize
- No images needed (text-only sections with Lucide icons for values)
- The "About" link in footer goes into the existing `product` array in `footerLinks`
- No separate `_components/` extraction — single page component is sufficient for static content

---

- [x] **Task 1: Create About page Server Component**
  - File: `src/app/(landing)/about/page.tsx` (CREATE)
  - Pattern: `src/app/(landing)/privacy/page.tsx` for metadata + Server Component structure; `src/app/(landing)/contact/page.tsx:48-58` for section layout pattern
  - Imports:
    ```ts
    import type { Metadata } from 'next';
    import Link from 'next/link';
    import { T } from 'gt-next';
    import { Target, Users, Zap, Heart, Code, ArrowRight } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    ```
  - Steps:
    1. Export `metadata` with title, description, and openGraph:
       ```ts
       export const metadata: Metadata = {
         title: 'About',
         description:
           'Learn about Blueprint — the production-ready Next.js foundation for building B2B SaaS applications.',
         openGraph: {
           title: 'About Blueprint',
           description:
             'Learn about Blueprint — the production-ready Next.js foundation for building B2B SaaS applications.',
         },
       };
       ```
    2. Export default `AboutPage` function returning `React.ReactElement`
    3. Page structure (all text wrapped in `<T>` with appropriate IDs):
       - **Hero section**: `<section className="py-16 md:py-24">` with centered container `mx-auto max-w-3xl px-4 sm:px-6 lg:px-8`
         - `h1` with `text-3xl font-bold tracking-tight sm:text-4xl` — "About Blueprint"
         - Subtitle `p` with `mt-4 text-lg text-muted-foreground` — brief mission statement
       - **Mission section**: `<section className="py-16 md:py-24 border-t bg-muted/30">`
         - Container `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
         - Grid layout `grid gap-12 md:grid-cols-2` with mission text on left, vision text on right
         - Each side: `h2` with `text-2xl font-semibold`, `p` with `mt-4 text-muted-foreground`
         - i18n IDs: `about.mission.title`, `about.mission.description`, `about.vision.title`, `about.vision.description`
       - **Values section**: `<section className="py-16 md:py-24">`
         - Container `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
         - Section header centered: `h2` "Our Values"
         - Grid `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`
         - Each value card: `<div className="rounded-xl border bg-background p-6">`
           - Lucide icon in `<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">` with `className="size-5"`
           - `h3` with `mt-4 text-lg font-semibold`
           - `p` with `mt-2 text-sm text-muted-foreground`
         - Values (4 items): Ship Fast (Zap icon), Developer First (Code icon), Quality Matters (Target icon), Open & Transparent (Heart icon)
         - i18n IDs: `about.values.title`, `about.values.shipFast.title`, `about.values.shipFast.description`, etc.
       - **Story section**: `<section className="py-16 md:py-24 border-t bg-muted/30">`
         - Container `mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center`
         - `h2` "The Story" — `about.story.title`
         - Two `p` paragraphs explaining the product origin — `about.story.p1`, `about.story.p2`
       - **CTA section**: `<section className="py-16 md:py-24">`
         - Container centered `mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center`
         - `h2` "Ready to get started?" — `about.cta.title`
         - `p` subtitle — `about.cta.description`
         - Two buttons (same pattern as hero-section.tsx:38-45):
           ```tsx
           <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
             <Button size="lg" className="min-w-40" asChild>
               <Link href="/login">
                 <T id="about.cta.getStarted">Get Started</T>
                 <ArrowRight className="ml-2 size-4" />
               </Link>
             </Button>
             <Button size="lg" variant="outline" className="min-w-40" asChild>
               <Link href="/contact">
                 <T id="about.cta.contact">Contact Us</T>
               </Link>
             </Button>
           </div>
           ```
  - Criterion: `bun run build` passes; `ls src/app/\(landing\)/about/page.tsx` succeeds

- [x] **Task 2: Add About link to Footer**
  - File: `src/components/layout/Footer.tsx` (MODIFY)
  - Pattern: existing `footerLinks.product` array at line 9-14
  - Steps:
    1. Add `{ label: 'About', href: '/about', id: 'about' }` to `footerLinks.product` array, after the "Contact" entry (line 13):
       ```ts
       // Before (line 9-14):
       product: [
         { label: 'Features', href: '/#features', id: 'features' },
         { label: 'Pricing', href: '/pricing', id: 'pricing' },
         { label: 'Documentation', href: '/docs', id: 'documentation' },
         { label: 'Contact', href: '/contact', id: 'contact' },
       ],

       // After:
       product: [
         { label: 'Features', href: '/#features', id: 'features' },
         { label: 'Pricing', href: '/pricing', id: 'pricing' },
         { label: 'Documentation', href: '/docs', id: 'documentation' },
         { label: 'About', href: '/about', id: 'about' },
         { label: 'Contact', href: '/contact', id: 'contact' },
       ],
       ```
  - Criterion: `grep "About" src/components/layout/Footer.tsx` returns the new entry; `bun run build` passes
