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
| `NEXT_PUBLIC_BRAND_LOGO` | `siteConfig.logo` | `/images/black_logo.png` |
| `NEXT_PUBLIC_BRAND_OG_IMAGE` | `siteConfig.ogImage` | `/images/banner.png` |
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
| `NEXT_PUBLIC_FEATURE_MARKETING_SITE` | flag for a fork that overrides `/` with its own landing | on |

## 5. Pricing as config

The pricing offer lives in `src/config/pricing.ts` (`pricingConfig` / `featuredPlan`):
price, period, inclusions, and CTAs. The pricing page renders from it, so changing
the offer (or scripting it) is a config edit, not a JSX edit. The shape is a
`plans[]` array so it also supports multiple recurring tiers later.

## What this does NOT cover yet (follow-ups)

- Landing marketing copy (`(landing)/about`, `features-section`, `contact`) still
  carries inline brand text — a future PR could route it through a `landingContent`
  config so the copy is one file.
- Graceful degradation for optional integrations (Maps, Cal.com, Resend, OpenAI,
  PostHog) when their env is unset, so a minimal fork runs on auth + Convex only.
