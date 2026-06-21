import Image from 'next/image';

import type { AuthPagesConfig } from '@carefully-built/auth-pages/config';

import { siteConfig } from '@/config/site';

export const authPagesConfig = {
  logo: (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={112}
      height={28}
      className="h-7 w-auto object-contain"
    />
  ),
  visual: {
    backgroundSrc: '/images/website/background.png',
    foregroundSrc: '/images/banner.png',
    alt: `${siteConfig.name} platform preview`,
  },
  legal: {
    consentText: 'By continuing, you agree to our',
  },
} satisfies AuthPagesConfig;
