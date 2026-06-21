'use client';

import { DashboardWidget } from '@carefully-built/saas-kit/widgets';
import { BarChart3 } from 'lucide-react';

export function OpportunityOverviewCard(): React.ReactElement {
  return (
    <DashboardWidget
      icon={BarChart3}
      title="KPI"
      isEmpty
      emptyState={{
        title: 'No KPI available',
        description: 'Opportunity performance metrics will appear here.',
      }}
    />
  );
}
