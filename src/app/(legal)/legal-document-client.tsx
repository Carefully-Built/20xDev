'use client';

import { LegalDocument, privacyPolicyText, termsAndConditionsText } from '@carefully-built/saas-kit/legal-ui';
import Image from 'next/image';

import { siteConfig } from '@/config/site';

type LegalDocumentType = 'privacy' | 'terms';

interface LegalDocumentClientProps {
  readonly type: LegalDocumentType;
}

const legalDocuments = {
  privacy: {
    title: 'Privacy Policy',
    content: privacyPolicyText,
  },
  terms: {
    title: 'Terms and Conditions',
    content: termsAndConditionsText,
  },
} satisfies Record<LegalDocumentType, { title: string; content: string }>;

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

export function LegalDocumentClient({ type }: LegalDocumentClientProps): React.ReactElement {
  const document = legalDocuments[type];

  return (
    <LegalDocument
      title={document.title}
      content={document.content}
      logo={<Logo />}
    />
  );
}
