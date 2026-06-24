# Rebranding 20xDev (white-label a fork)

20xDev exposes a small, config-only brand surface so a fork can rebrand without
editing source. Defaults preserve the current 20xdev identity when nothing is set.

## 1. Set brand env vars

All are optional and live under `NEXT_PUBLIC_BRAND_*` (see `.env.example`):

| Env var | Drives | Default |
|---|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | `siteConfig.name` (header, footer, titles) | `20xdev` |
| `NEXT_PUBLIC_BRAND_COMPANY` | `siteConfig.companyName` (legal/copyright) | `20xdev` |
| `NEXT_PUBLIC_BRAND_DESCRIPTION` | `siteConfig.description` (SEO, footer) | 20xdev tagline |
| `NEXT_PUBLIC_BRAND_LOGO` | `siteConfig.logo` — image path, or `wordmark` for a text fallback | `/images/black_logo.png` |
| `NEXT_PUBLIC_BRAND_OG_IMAGE` | `siteConfig.ogImage` | `/images/banner.png` |
| `NEXT_PUBLIC_BRAND_AUTH_PREVIEW` | `siteConfig.authPreviewImage` — login/signup preview image | `/images/banner.png` |
| `NEXT_PUBLIC_BRAND_EMAIL` | `siteConfig.email` | `hello@20xdev.com` |
| `NEXT_PUBLIC_BRAND_GITHUB` | `siteConfig.social.github` + footer | 20xdev GitHub |
| `NEXT_PUBLIC_BRAND_TWITTER` | `siteConfig.social.twitter` + footer | 20xdev X |
| `NEXT_PUBLIC_BRAND_ATTRIBUTION` | shows the "Built with 20xDev" credit badge | `0` (off) |

## 2. Drop brand assets

Point the asset vars at your own files. Convention: keep them together under
`public/brand/` so the swap is one folder:

```
public/brand/logo.png
public/brand/og.png
```
```bash
NEXT_PUBLIC_BRAND_LOGO=/brand/logo.png
NEXT_PUBLIC_BRAND_OG_IMAGE=/brand/og.png
```

**No logo image? Use the text wordmark.** Set `NEXT_PUBLIC_BRAND_LOGO=wordmark`
and every logo slot (site header, auth pages, dashboard sidebar, legal pages)
renders `siteConfig.name` as styled text instead of an image. This is the
recommended starting point for a fork that has only set `NEXT_PUBLIC_BRAND_NAME`,
since it guarantees 20xdev's logo image never appears. (`BrandLogo` —
`src/components/shared/brand-logo.tsx` — is the shared component behind all slots.)

## 3. Keep (or drop) the kit credit

The "Built with 20xDev" badge is a discrete component
(`src/components/shared/powered-by.tsx`), separate from the product brand. It is
**off by default**. A fork that wants to credit the kit sets
`NEXT_PUBLIC_BRAND_ATTRIBUTION=1`; the badge renders once in the footer and is the
only place the upstream name appears.

## 4. Hide marketing surfaces (feature flags)

`siteConfig.features` lets a fork drop surfaces it doesn't ship, cleanly — the
nav/footer entry disappears (no dangling links) and the route itself 404s. All
default **on**, so 20xdev's own site is unchanged.

| Env var | Effect | Default |
|---|---|---|
| `NEXT_PUBLIC_FEATURE_BLOG` | `=0` removes Blog nav + 404s `/blog` (and skips Sanity at build) | on |
| `NEXT_PUBLIC_FEATURE_STUDIO` | `=0` 404s `/studio` | on |
| `NEXT_PUBLIC_FEATURE_MARKETING_SITE` | `=0` drops 20xdev's marketing — see below | on |

When `NEXT_PUBLIC_FEATURE_MARKETING_SITE=0` (a fork that brings its own landing):

- **`/about`** 404s.
- **`/` (home)** drops the 20xdev marketing sections (hero, proof, showcase,
  features, tech-stack, FAQ) and renders a minimal branded hero instead — a
  centered `siteConfig.name` + `siteConfig.description` + a primary CTA to
  `/pricing`. The route is never blank.
- **Landing footer CTA card** (the "Built for 20x companies" / "Get the …€ deal"
  card) is removed, so no 20xdev marketing copy leaks into a fork's footer.

The footer columns/links and legal/dashboard surfaces are unaffected. Default
(flag on) leaves 20xdev's own site byte-for-byte unchanged.

## 5. Pricing as config

The pricing offer lives in `src/config/pricing.ts` (`pricingConfig` / `featuredPlan`):
price, period, inclusions, and CTAs. The pricing page renders from it, so changing
the offer (or scripting it) is a config edit, not a JSX edit. The shape is a
`plans[]` array so it also supports multiple recurring tiers later.

The **landing footer CTA card** (when shown) also reads `featuredPlan` for its
price label and button text, so the footer offer can never drift from the pricing
page. 20xdev's default plan is `79€`, so the rendered copy is unchanged.

## 6. Dashboard sidebar default state

A fork can start the dashboard sidebar collapsed by setting
`NEXT_PUBLIC_SIDEBAR_DEFAULT_COLLAPSED=1`. Unset (default) leaves it expanded,
exactly as 20xdev ships. The toggle inside the sidebar still works either way.

## 7. Internationalization (locale default + switcher)

The app uses [gt-next](https://generaltranslation.com) (General Translation). The
supported locales and default live in `gt.config.json` (`en`, `it`; default `en`).

- **Browser-locale default.** `src/middleware.ts` runs
  `createNextMiddleware({ localeRouting: false })`. With routing disabled it
  detects the locale from the request `Accept-Language` header (when no locale
  cookie is set) and exposes it to the server render **without** adding any
  `/<locale>` URL prefix or redirect — so existing routes/links are untouched.
  The root layout reads it via `getLocale()` and sets `<html lang>`. Resolution
  priority is **cookie → `Accept-Language` → default (`en`)**, so a first-time
  Italian-browser visitor sees Italian content, matching the embedded WorkOS
  widget (which already localizes to the browser).
- **Language switcher.** `src/components/shared/language-switcher.tsx` wraps
  gt-next's `<LocaleSelector>` (lists the `gt.config.json` locales) and is placed
  in the footer. Selecting a language writes the `generaltranslation.locale`
  cookie and re-renders; the cookie then overrides `Accept-Language`.
- **A fork adds a language** by adding its locale to `gt.config.json` `locales`
  (and providing translations via the GT project) — the switcher and detection
  pick it up automatically. A single-locale fork: `<LocaleSelector>` renders
  nothing, and detection always resolves to the one locale.

## What this does NOT cover yet (follow-ups)

- Landing marketing copy (`(landing)/about`, `features-section`, `contact`) still
  carries inline brand text — a future PR could route it through a `landingContent`
  config so the copy is one file.
- Graceful degradation for optional integrations (Maps, Cal.com, Resend, OpenAI,
  PostHog) when their env is unset, so a minimal fork runs on auth + Convex only.
