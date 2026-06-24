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
      title="Scegli organizzazione"
      description="Il tuo account ha accesso a piu organizzazioni."
      searchPlaceholder="Cerca organizzazione..."
      emptyTitle="Nessuna organizzazione trovata"
      emptyDescription="Prova a cercare con un nome diverso."
      itemDescription="Continua con questa organizzazione"
      noOrganizationsTitle="Nessuna organizzazione disponibile"
      noOrganizationsDescription="Non ci sono organizzazioni collegate a questo account."
      dashboardLabel="Vai alla dashboard"
      loginLabel="Torna al login"
    />
  );
}
