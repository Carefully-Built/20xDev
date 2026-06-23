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

## What this does NOT cover yet (follow-ups)

- Landing marketing copy (`(landing)/about`, `features-section`, `contact`) still
  carries inline brand text — a future PR could route it through a `landingContent`
  config so the copy is one file.
- Optional `features.marketingBlog` / `features.studio` flags to hide the blog and
  Sanity studio route groups cleanly (instead of deleting them).
