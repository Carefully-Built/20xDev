'use client';

import Image from 'next/image';

import { siteConfig } from '@/config/site';

export function DashboardLogo(): React.ReactElement {
  return (
    <>
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        height={28}
        width={128}
        className="shrink-0 dark:brightness-0 dark:invert"
        style={{ height: 28, width: 128 }}
        priority
      />
      <span className="sr-only">{siteConfig.name}</span>
    </>
  );
}
