import type { OpportunityStageDefinition } from './types';

export const opportunityStages: readonly OpportunityStageDefinition[] = [
  {
    id: 'qualified',
    label: 'Qualified',
    dotClassName: 'bg-violet-500',
    badgeClassName: 'bg-violet-50 text-violet-700 ring-violet-200/80',
  },
  {
    id: 'proposal',
    label: 'Proposal',
    dotClassName: 'bg-pink-500',
    badgeClassName: 'bg-pink-50 text-pink-700 ring-pink-200/80',
  },
  {
    id: 'won',
    label: 'Won',
    dotClassName: 'bg-emerald-500',
    badgeClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
  },
  {
    id: 'lost',
    label: 'Lost',
    dotClassName: 'bg-orange-600',
    badgeClassName: 'bg-orange-50 text-orange-700 ring-orange-200/80',
  },
] as const;
