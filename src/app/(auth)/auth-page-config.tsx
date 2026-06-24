import type { AuthPagesConfig } from '@carefully-built/saas-kit/auth-pages/config';

import { BrandLogo } from '@/components/shared/brand-logo';
import { siteConfig } from '@/config/site';

export const authPagesConfig = {
  logo: (
    <BrandLogo width={112} height={28} className="h-7 w-auto object-contain" />
  ),
  visual: {
    backgroundSrc: '/images/website/background.png',
    foregroundSrc: siteConfig.authPreviewImage,
    alt: `${siteConfig.name} platform preview`,
  },
  legal: {
    consentText: 'By continuing, you agree to our',
  },
} satisfies AuthPagesConfig;
