import { LegalDocument, privacyPolicyText } from '@carefully-built/saas-kit/legal-ui';
import Image from 'next/image';

import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

function Logo(): React.ReactElement {
  return (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={162}
      height={36}
      className="h-8 w-auto object-contain sm:h-9"
    />
  );
}

export default function PrivacyPage(): React.ReactElement {
  return (
    <LegalDocument
      title="Privacy Policy"
      content={privacyPolicyText}
      logo={<Logo />}
    />
  );
}
