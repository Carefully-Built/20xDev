import { OrganizationSelectionPage } from '@carefully-built/saas-kit/auth-pages/organizations';
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
      searchPlaceholder="Search organizations..."
      emptyTitle="No organizations found"
      emptyDescription="Try searching for a different name."
      itemDescription="Continue with this organization"
      noOrganizationsTitle="No organizations available"
      noOrganizationsDescription="There are no organizations connected to this account."
      dashboardLabel="Go to dashboard"
      loginLabel="Back to login"
    />
  );
}
