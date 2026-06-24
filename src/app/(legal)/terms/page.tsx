import { LegalDocument, termsAndConditionsText } from '@carefully-built/saas-kit/legal-ui';

import type { Metadata } from 'next';

import { BrandLogo } from '@/components/shared/brand-logo';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
};

function Logo(): React.ReactElement {
  return <BrandLogo width={162} height={36} className="h-8 w-auto object-contain sm:h-9" />;
}

export default function TermsPage(): React.ReactElement {
  return (
    <LegalDocument
      title="Terms and Conditions"
      content={termsAndConditionsText}
      logo={<Logo />}
    />
  );
}
