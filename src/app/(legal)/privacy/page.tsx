import { LegalDocumentClient } from '../legal-document-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage(): React.ReactElement {
  return <LegalDocumentClient type="privacy" />;
}
