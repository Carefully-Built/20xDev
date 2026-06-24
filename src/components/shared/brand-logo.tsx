import Image from 'next/image';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
  readonly priority?: boolean;
  readonly style?: React.CSSProperties;
}

/**
 * Brand logo with a text-wordmark fallback.
 *
 * When `siteConfig.logo === 'wordmark'` (a fork sets
 * `NEXT_PUBLIC_BRAND_LOGO=wordmark`), renders the brand name as text instead of
 * an image — so a fork that only sets `NEXT_PUBLIC_BRAND_NAME` never ships
 * 20xdev's logo image. Otherwise renders the existing `<Image>` exactly as
 * before, preserving each call site's sizing via the passed props.
 *
 * Default (`siteConfig.logo` unset → `/images/black_logo.png`) is unchanged.
 */
export function BrandLogo({
  className,
  width,
  height,
  priority,
  style,
}: BrandLogoProps): React.ReactElement {
  if (siteConfig.logo === 'wordmark') {
    return (
      <span
        className={cn('font-semibold whitespace-nowrap', className)}
        style={{ width, height, ...style }}
      >
        {siteConfig.name}
      </span>
    );
  }

  return (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={style}
    />
  );
}
