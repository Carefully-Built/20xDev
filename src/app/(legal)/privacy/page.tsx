import { LegalDocument, privacyPolicyText } from '@carefully-built/saas-kit/legal-ui';

import type { Metadata } from 'next';

import { BrandLogo } from '@/components/shared/brand-logo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

function Logo(): React.ReactElement {
  return <BrandLogo width={162} height={36} className="h-8 w-auto object-contain sm:h-9" />;
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
