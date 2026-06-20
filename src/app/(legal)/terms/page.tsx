import { LegalDocument, termsAndConditionsText } from '@carefully-built/legal-ui';
import Image from 'next/image';

import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
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

export default function TermsPage(): React.ReactElement {
  return (
    <LegalDocument
      title="Terms and Conditions"
      content={termsAndConditionsText}
      logo={<Logo />}
    />
  );
}
