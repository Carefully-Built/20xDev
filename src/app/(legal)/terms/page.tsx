import { LegalDocumentClient } from '../legal-document-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
};

export default function TermsPage(): React.ReactElement {
  return <LegalDocumentClient type="terms" />;
}
