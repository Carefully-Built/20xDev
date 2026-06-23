import { siteConfig } from '@/config/site';

/**
 * "Built with 20xDev" attribution credit.
 *
 * Rendered only when `siteConfig.attribution.enabled` is true
 * (NEXT_PUBLIC_BRAND_ATTRIBUTION=1). This isolates the kit credit from the
 * product brand so forks can keep a single, intentional attribution badge
 * while replacing every other brand reference. Returns null otherwise, so
 * 20xdev's own site is unaffected by default.
 */
export function PoweredBy({ className }: { readonly className?: string }): React.ReactElement | null {
  if (!siteConfig.attribution.enabled) {
    return null;
  }

  return (
    <a
      href={siteConfig.attribution.href}
      target="_blank"
      rel="noopener noreferrer"
      className={['text-xs opacity-70 transition-opacity hover:opacity-100', className ?? ''].join(' ')}
    >
      {siteConfig.attribution.label}
    </a>
  );
}
