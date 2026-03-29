'use client';

import { OpportunityBoard } from '../crm/_components/opportunity-board';
import { mockOpportunities } from '../crm/_lib';

export default function OpportunitiesPage(): React.ReactElement {
  return <OpportunityBoard opportunities={mockOpportunities} />;
}
