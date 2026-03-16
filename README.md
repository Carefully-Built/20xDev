# Blueprint

Blueprint is a Next.js SaaS starter currently branded as `20xdev` in the app config and marketing copy. This README reflects the codebase as it exists today: what is already working, what is partially wired, and what still needs to be configured.

## Current Status

The project already has a working foundation for:

- Marketing site and public pages
- Email/password auth with WorkOS AuthKit
- Multi-organization flows with WorkOS widgets
- Convex-backed app data
- Protected dashboard area
- Items and files CRUD flows
- Blog and Sanity Studio integration
- Basic internationalization plumbing with General Translation
- Optional PostHog client instrumentation

The project does **not** yet have real application code for several technologies still mentioned in parts of the site or older docs. Those are listed below under "Still To Configure / Not Implemented Yet".

## Stack Actually Present In The Repo

### Core

- Next.js 16
- React 19
- TypeScript 5
- Bun

### UI

- Tailwind CSS 4
- shadcn/ui
- Radix-based primitives
- next-themes
- Sonner
- Geist fonts
- Hugeicons and Lucide icons

### Data and Backend

- Convex
- Zod
- React Hook Form
- TanStack Query
- nuqs

### Auth and Organizations

- WorkOS Node SDK
- WorkOS AuthKit for Next.js
- `@convex-dev/workos-authkit` for Convex auth integration
- WorkOS widgets for account and organization management

### Content and Marketing

- Sanity
- next-sanity
- Sanity Studio at `/studio`
- Cal.com link support on the contact page

### Analytics and i18n

- PostHog client integration is present, but environment setup is still needed
- General Translation (`gt-next`) is installed with `en` and `it` locales configured

### Code Quality

- ESLint
- Prettier
- SonarCloud GitHub Action
- Knip is installed as a dependency, but it is not yet wired into scripts or CI

## Features Already Built

- Public landing pages: home, pricing, about, contact, blog, privacy, terms
- Auth routes: login, signup, forgot password, update password
- Dashboard shell and protected layout
- Organization create, switch, update, and delete flows
- Convex tables for users, organizations, items, and files
- File upload UI and file listing flows
- Blog category pages and post detail pages
- Sanity revalidation endpoint at `/api/revalidate`
- WorkOS token endpoints for widgets

## Environment Variables In Use

These variables are referenced by the current codebase or scripts:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex client URL used by the app |
| `CONVEX_DEPLOY_KEY` | Production only | Required when production builds should deploy Convex |
| `WORKOS_API_KEY` | Yes | WorkOS server SDK |
| `WORKOS_CLIENT_ID` | Yes | WorkOS AuthKit / OAuth flows |
| `WORKOS_COOKIE_PASSWORD` | Yes | Session encryption |
| `WORKOS_REDIRECT_URI` | Yes | WorkOS callback URL |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical app URL, used in blog metadata |
| `NEXT_PUBLIC_CAL_DISCOVERY_CALL_URL` | Optional | Contact page booking link |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes for Sanity | Sanity client and Studio config |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes for Sanity | Sanity dataset |
| `SANITY_REVALIDATE_SECRET` | Needed for webhook revalidation | Validates Sanity webhook requests |
| `SANITY_API_TOKEN` | Optional | Used by `scripts/seed-content.mjs` |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | Enables PostHog in the frontend |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | Overrides default PostHog host |
| `NEXT_PUBLIC_POSTHOG_DEV` | Optional | Allows PostHog during development |

## Still To Configure / Not Implemented Yet

### Config that still needs finishing

- Production WorkOS settings still need to be confirmed:
  `WORKOS_REDIRECT_URI` and `NEXT_PUBLIC_APP_URL` should match the final deployed domain.
- Sanity webhook setup is incomplete until `SANITY_REVALIDATE_SECRET` is added and the webhook is configured in Sanity.
- PostHog is optional and only becomes active once the PostHog env vars are added.
- A clean `.env.example` file is missing even though setup scripts expect one.
- Secrets are currently stored in the local `.env`; this should stay untracked and be rotated if any real credentials were ever committed.

### Packages or tools present but only partially adopted

- `gt-next` is installed and used in parts of the UI, but localization is not yet complete across the whole app.
- Knip is installed, but there is no `bun run knip` script and no CI enforcement for unused code.
- SonarCloud is configured in GitHub Actions, but CodeRabbit is referenced in docs/marketing only and is not configured in this repo.

### Technologies mentioned in older docs or marketing but not implemented in app code

- Stripe
- Resend
- OpenAI
- DataFast
- Featurebase
- IndexNow
- Onboarda
- AffiliateBase

These may still be part of the intended product direction, but they are not configured as real runtime integrations in the current codebase.

## Local Development

This repo uses Bun.

```bash
bun install
npx convex dev
bun dev
```

Useful commands:

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run typecheck
bun run check
bun run format
```

Notes:

- `bun run build` triggers `convex deploy` only when `VERCEL_ENV=production`.
- `scripts/setup.sh` expects `.env.example`, but that file does not currently exist.
- Sanity Studio is available at `/studio`.

## Project Structure

```text
src/
  app/                 Next.js App Router pages, layouts, and route handlers
  components/          Shared UI and layout components
  config/              Site-wide config
  hooks/               Custom React hooks
  lib/                 Utilities and integration helpers
  providers/           App providers
  sanity/              Sanity client, config, schemas
  types/               Shared TypeScript types

convex/
  functions/           Queries and mutations
  tables/              Table definitions
  schema.ts            Combined Convex schema
  auth.ts              Convex auth integration
```

## Recommended Next Steps

1. Add a safe `.env.example` that matches the variables above.
2. Decide which "planned" integrations are actually in scope and remove the rest from marketing sections.
3. Finish production configuration for WorkOS, Sanity webhooks, and optional PostHog.
4. Add missing CI/runtime wiring for tools that are already installed, especially Knip.

## License

MIT
