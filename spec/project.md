# Project Constitution — Blueprint

## Overview

B2B SaaS production-ready template by Carefully-Built. Provides auth, payments, real-time data, CMS blog, and stunning UI out of the box.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript strict
- **Runtime/Package Manager**: Bun
- **Backend**: Convex (real-time, type-safe)
- **Auth**: WorkOS AuthKit (iron-session for cookie management)
- **Payments**: Stripe
- **CMS**: Sanity (headless, embedded studio at `/studio`)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4 + Lucide icons
- **State**: TanStack Query + nuqs (URL params)
- **i18n**: General Translation (`gt-next`)
- **Analytics**: Plausible
- **Monitoring**: Sentry
- **Email**: Resend
- **Deploy**: Vercel

## Commands

- `bun install` — install deps
- `bun run dev` — dev server (Turbopack)
- `bun run build` — production build (`npx convex deploy && bunx --bun next build`)
- `bun run lint` — ESLint (zero warnings)
- `bun run typecheck` — TypeScript strict
- `bun run check` — typecheck + lint

## Directory Structure

```
src/
  app/
    (landing)/       # Public marketing pages (hero, features, FAQ, blog, contact, privacy, terms)
    (auth)/          # Auth pages (login, signup, forgot-password, update-password)
    dashboard/       # Authenticated dashboard (analytics, customers, products, orders, settings)
    studio/          # Embedded Sanity Studio
    api/             # API routes (auth, webhooks)
    layout.tsx       # Root layout (GTProvider, Providers, TooltipProvider, Toaster)
  components/
    layout/          # PageLayout, SiteHeader, Footer, MainNav, MobileNav, AuthButton
    shared/          # SmartTable, TableToolbar, reusable components
    forms/           # CustomForm (react-hook-form + zod)
    ui/              # shadcn/ui primitives
    workos/          # WorkOS-specific components
  config/            # site.ts (nav items, site metadata)
  hooks/             # Custom hooks (use-pagination, etc.)
  lib/               # Utilities (utils.ts, csv-export, filters, session)
  providers/         # Context providers
  types/             # Shared TypeScript types
convex/              # Convex backend (schema, queries, mutations)
```

## Patterns

- **Server Components by default** — Client Components only for interactivity (`'use client'` directive)
- **Route groups**: `(landing)` for public pages, `(auth)` for auth flow, `dashboard` for authenticated
- **Middleware**: `src/middleware.ts` handles auth redirect (iron-session cookie check)
- **i18n**: `<T>` component from `gt-next` wraps translatable strings, `<T id="ns.key">` with explicit IDs for stable keys
- **Config**: `gt.config.json` at root, `withGTConfig()` wraps next.config.ts
- **Language switching**: `useLocale()` + `useSetLocale()` from `gt-next/client`
- **Dark mode**: `next-themes` with system/light/dark via ThemeToggle component
- **Forms**: `react-hook-form` + `zod` via `CustomForm` wrapper
- **Error handling**: `catch (err: unknown)` with `instanceof Error` narrowing
- **Exports**: Named exports (no default exports except pages)
