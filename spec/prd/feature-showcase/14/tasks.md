# Tasks — Issue #14: Feature Showcase Sections

## Architecture Context

**Existing patterns to follow:**
- `src/config/pricing.ts` — data-driven config with `readonly` interfaces and `as const` arrays
- `src/components/marketing/pricing-card.tsx` — marketing component pattern (named export, typed props, Lucide icons, `<T>` i18n)
- `src/app/(landing)/_components/features-section.tsx` — current feature section (to be replaced), uses `'use client'`, Animate UI `Fade`/`Slide`, shadcn `Card`
- `src/app/(landing)/_components/tech-stack-section.tsx` — section layout pattern with `max-w-7xl`, `py-24`, responsive grid

**Component pattern:** All landing sections are `'use client'` because they use Animate UI (`Fade`, `Slide`) which requires client-side rendering. Each section component is self-contained with its own section title/description and responsive grid.

**i18n pattern:** `<T id="namespace.key">Default English text</T>` from `gt-next`.

---

## Tasks

- [ ] **Task 1: Create feature data config (`src/config/features.ts`)**
  - File: `src/config/features.ts` (CREATE)
  - Pattern: copy structure from `src/config/pricing.ts` (readonly interfaces, `as const` arrays)
  - Imports:
    ```ts
    import type { LucideIcon } from 'lucide-react';
    import {
      Rocket, Bot, Building2, Layers, Shield, Zap,
      BarChart3, Globe, Lock, Paintbrush, Database, Clock,
      CheckCircle2, Users, CreditCard, Mail
    } from 'lucide-react';
    ```
  - Define 3 interfaces:
    ```ts
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
    ```
  - Create `featureGridItems` array (6 items) — the main feature grid showcasing Blueprint capabilities:
    ```ts
    export const featureGridItems: readonly FeatureGridItem[] = [
      {
        icon: Rocket,
        title: 'Production-Ready',
        description: 'Ship faster with pre-built auth, dashboard, and payments. Everything you need to go live, out of the box.',
      },
      {
        icon: Bot,
        title: 'AI-Optimized',
        description: 'Clean architecture with clear patterns, perfect for AI code generation. Let AI help you build faster.',
      },
      {
        icon: Building2,
        title: 'B2B SaaS Ready',
        description: 'Multi-tenant by design with org management and role-based access. Enterprise features built-in.',
      },
      {
        icon: Layers,
        title: 'Modern Stack',
        description: 'Next.js 16, Convex, WorkOS, and shadcn/ui. The latest tools for building exceptional products.',
      },
      {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'SSO, SCIM, directory sync, and audit logs. Meet enterprise compliance requirements from day one.',
      },
      {
        icon: Zap,
        title: 'Real-Time Data',
        description: 'Convex provides instant data sync across all clients. No WebSocket setup or state management hassle.',
      },
    ] as const;
    ```
  - Create `featureWithImageItems` array (3 items) — deeper dives into key features with screenshots:
    ```ts
    export const featureWithImageItems: readonly FeatureWithImageItem[] = [
      {
        icon: BarChart3,
        title: 'Beautiful Dashboard',
        description: 'A fully-featured admin dashboard with analytics, data tables, file management, and organization settings. Built with shadcn/ui components and responsive from mobile to desktop.',
        image: '/images/features/dashboard.png',
        imageAlt: 'Blueprint dashboard showing analytics and data management',
      },
      {
        icon: Lock,
        title: 'Authentication & Teams',
        description: 'Enterprise-grade auth with WorkOS AuthKit. Social login, email/password, SSO, and multi-tenant organization management with role-based access control.',
        image: '/images/features/auth.png',
        imageAlt: 'Blueprint authentication and team management interface',
      },
      {
        icon: Paintbrush,
        title: 'Stunning Landing Pages',
        description: 'Conversion-optimized marketing pages with smooth animations, dark mode support, and full responsiveness. Blog powered by Sanity CMS with SEO built-in.',
        image: '/images/features/landing.png',
        imageAlt: 'Blueprint landing page with hero section and features',
      },
    ] as const;
    ```
  - Create `featureListItems` array (6 items) — checklist-style features:
    ```ts
    export const featureListItems: readonly FeatureListItem[] = [
      {
        icon: CreditCard,
        title: 'Stripe Payments',
        description: 'Subscriptions, one-time charges, and usage-based billing with webhook sync to Convex.',
      },
      {
        icon: Globe,
        title: 'Internationalization',
        description: 'AI-powered translations with General Translation. Add new languages without maintaining JSON files.',
      },
      {
        icon: Database,
        title: 'Real-Time Database',
        description: 'Convex provides type-safe queries, mutations, and automatic real-time subscriptions.',
      },
      {
        icon: Mail,
        title: 'Transactional Email',
        description: 'Beautiful emails with Resend and React Email. Welcome emails, notifications, and more.',
      },
      {
        icon: Users,
        title: 'Organization Management',
        description: 'Multi-tenant architecture with WorkOS. Team invites, role management, and org switching.',
      },
      {
        icon: Clock,
        title: 'CI/CD Pipeline',
        description: 'GitHub Actions, CodeRabbit reviews, SonarCloud analysis, and Vercel deployments out of the box.',
      },
    ] as const;
    ```
  - Criterion: `bun run typecheck` passes, `grep -c "readonly" src/config/features.ts` returns >= 3

- [ ] **Task 2: Create FeatureGrid component (`src/components/marketing/feature-grid.tsx`)**
  - File: `src/components/marketing/feature-grid.tsx` (CREATE)
  - Pattern: follow `src/app/(landing)/_components/features-section.tsx` for section structure, card rendering, and animation pattern
  - Imports:
    ```ts
    'use client';

    import { T } from 'gt-next';

    import { Fade } from '@/components/animate-ui/fade';
    import { Slide } from '@/components/animate-ui/slide';
    import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { featureGridItems } from '@/config/features';
    ```
  - Component signature: `export function FeatureGrid(): React.ReactElement`
  - Structure:
    - `<section id="features" className="py-24">`
    - Container: `<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`
    - Header (wrapped in `<Fade inView inViewOnce inViewMargin="-50px">`):
      - `<h2>` with `<T id="featureGrid.title">Everything you need to ship</T>`
      - `<p>` with `<T id="featureGrid.description">Stop rebuilding the same infrastructure. Start with a foundation that scales.</T>`
    - Grid: `<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">`
    - Each item wrapped in `<Slide direction="up" delay={i * 100} inView inViewOnce inViewMargin="-50px">`
    - Card: `<Card className="border-0 bg-muted/50 transition-colors hover:bg-muted">`
      - Icon wrapper: `<div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">`
      - Icon: `<item.icon className="size-5 text-primary" />`
      - `<CardTitle className="text-lg">` with `<T>` wrapper
      - `<CardDescription className="text-sm leading-relaxed">` with `<T>` wrapper
  - Use i18n keys: `featureGrid.item0.title`, `featureGrid.item0.desc`, etc. (index-based to match array)
  - Criterion: `bun run typecheck` passes, file exports `FeatureGrid`

- [ ] **Task 3: Create FeatureWithImage component (`src/components/marketing/feature-with-image.tsx`)**
  - File: `src/components/marketing/feature-with-image.tsx` (CREATE)
  - Pattern: follow `src/app/(landing)/_components/tech-stack-section.tsx` for section structure with `border-t bg-muted/30` background variant
  - Imports:
    ```ts
    'use client';

    import { T } from 'gt-next';
    import Image from 'next/image';

    import { Fade } from '@/components/animate-ui/fade';
    import { Slide } from '@/components/animate-ui/slide';
    import { featureWithImageItems } from '@/config/features';
    ```
  - Component signature: `export function FeatureWithImage(): React.ReactElement`
  - Structure:
    - `<section className="border-t bg-muted/30 py-24">`
    - Container: `<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`
    - Header (wrapped in `<Fade inView inViewOnce inViewMargin="-50px">`):
      - Subtitle: `<p className="text-sm font-semibold uppercase tracking-wider text-primary">` with `<T id="featureWithImage.subtitle">See it in action</T>`
      - `<h2>` with `<T id="featureWithImage.title">Built for real products</T>`
      - `<p>` with `<T id="featureWithImage.description">Every feature designed, tested, and ready for production use.</T>`
    - Items: `<div className="mt-16 space-y-24">`
    - Each item wrapped in `<Slide direction="up" delay={100} inView inViewOnce inViewMargin="-80px">`
    - Layout: `<div className={cn("flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16", i % 2 === 1 && "lg:flex-row-reverse")}>`
      - Text side: `<div className="flex-1 space-y-4">`
        - Icon + title row: icon in `<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">`, title in `<h3 className="text-2xl font-semibold">`
        - Description: `<p className="text-lg text-muted-foreground leading-relaxed">`
      - Image side: `<div className="flex-1">`
        - `<div className="overflow-hidden rounded-xl border bg-muted/50 shadow-sm">`
        - `<Image src={item.image} alt={item.imageAlt} width={600} height={400} className="size-full object-cover" />`
  - Import `cn` from `@/lib/utils` for the alternating layout
  - Use i18n keys: `featureWithImage.item0.title`, `featureWithImage.item0.desc`, etc.
  - Criterion: `bun run typecheck` passes, file exports `FeatureWithImage`

- [ ] **Task 4: Create FeatureList component (`src/components/marketing/feature-list.tsx`)**
  - File: `src/components/marketing/feature-list.tsx` (CREATE)
  - Pattern: follow `src/components/marketing/pricing-card.tsx` for list-with-icon pattern (Check icon style)
  - Imports:
    ```ts
    'use client';

    import { T } from 'gt-next';

    import { Fade } from '@/components/animate-ui/fade';
    import { Slide } from '@/components/animate-ui/slide';
    import { featureListItems } from '@/config/features';
    ```
  - Component signature: `export function FeatureList(): React.ReactElement`
  - Structure:
    - `<section className="py-24">`
    - Container: `<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`
    - Header (wrapped in `<Fade inView inViewOnce inViewMargin="-50px">`):
      - `<h2>` with `<T id="featureList.title">Everything included</T>`
      - `<p>` with `<T id="featureList.description">No hidden fees, no missing features. Everything you need in one template.</T>`
    - Grid: `<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">`
    - Each item wrapped in `<Slide direction="up" delay={i * 100} inView inViewOnce inViewMargin="-50px">`
    - Item layout: `<div className="flex gap-4">`
      - Icon: `<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">` with `<item.icon className="size-5 text-primary" />`
      - Text: `<div>`
        - `<h3 className="font-semibold">` with `<T>` wrapper
        - `<p className="mt-1 text-sm text-muted-foreground leading-relaxed">` with `<T>` wrapper
  - Use i18n keys: `featureList.item0.title`, `featureList.item0.desc`, etc.
  - Criterion: `bun run typecheck` passes, file exports `FeatureList`

- [ ] **Task 5: Update landing page to use new feature sections (`src/app/(landing)/page.tsx`)**
  - File: `src/app/(landing)/page.tsx` (MODIFY)
  - Remove import: `import { FeaturesSection } from './_components/features-section';`
  - Add imports:
    ```ts
    import { FeatureGrid } from '@/components/marketing/feature-grid';
    import { FeatureWithImage } from '@/components/marketing/feature-with-image';
    import { FeatureList } from '@/components/marketing/feature-list';
    ```
  - Replace `<FeaturesSection />` with:
    ```tsx
    {/* Feature Grid */}
    <FeatureGrid />

    {/* Feature Showcase with Images */}
    <FeatureWithImage />

    {/* Feature List */}
    <FeatureList />
    ```
  - Keep ordering: HeroSection -> FeatureGrid -> FeatureWithImage -> FeatureList -> TechStackSection -> FaqSection -> CtaSection
  - Criterion: `bun run build` passes, landing page renders all 3 new sections

- [ ] **Task 6: Remove old FeaturesSection (cleanup)**
  - File: `src/app/(landing)/_components/features-section.tsx` (DELETE)
  - Verify no other files import it:
    ```bash
    grep -r "features-section" src/ --include="*.tsx" --include="*.ts"
    ```
    Should return 0 matches after Task 5 changes.
  - Criterion: file deleted, `bun run build` passes, `grep -r "FeaturesSection" src/` returns 0 matches

- [ ] **Task 7: Create placeholder feature images**
  - Directory: `public/images/features/` (CREATE)
  - Create 3 placeholder SVG images for the FeatureWithImage section:
    - `public/images/features/dashboard.png` — placeholder (can be a simple colored rectangle or screenshot later)
    - `public/images/features/auth.png` — placeholder
    - `public/images/features/landing.png` — placeholder
  - For now, create simple SVG placeholders renamed to `.png` is not ideal. Instead, update `FeatureWithImage` to gracefully handle missing images by wrapping `Image` in a container with a fallback `bg-muted` background:
    ```tsx
    <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl border bg-muted/50 shadow-sm">
      <Image ... />
    </div>
    ```
  - Alternative: use placeholder dimensions div with text "Screenshot coming soon" if images don't exist yet. The component should still render without errors.
  - Criterion: `bun run build` passes, no runtime errors on landing page

- [ ] **Task 8: Verify all acceptance criteria**
  - Run: `bun run build` — must pass
  - Run: `grep -r "feature" src/components/marketing/` — must return `feature-grid.tsx`, `feature-with-image.tsx`, `feature-list.tsx`
  - Run: `bun run typecheck` — must pass
  - Run: `bun run lint` — must pass (zero warnings)
  - Verify: no `any` types, no `@ts-ignore`
  - Verify: all `<T>` tags have `id` attributes for stable i18n keys
  - Criterion: all checks pass, all AC items satisfied
