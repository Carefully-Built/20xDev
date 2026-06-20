import { OrganizationSelectionPage } from '@carefully-built/auth-pages/organizations';
import { redirect } from 'next/navigation';

import { getPendingOrganizationSelection } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SelectOrganizationPage(): Promise<React.ReactElement> {
  const pending = await getPendingOrganizationSelection();

  if (!pending) {
    redirect('/login?error=organization_selection_expired');
  }

  return (
    <OrganizationSelectionPage
      organizations={pending.organizations}
      title="Choose organization"
      description="Your account has access to multiple organizations."
    />
  );
}
