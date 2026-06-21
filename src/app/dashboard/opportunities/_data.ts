import type { KanbanItem, KanbanPipelineConfig } from '@carefully-built/saas-kit/kanban';

export const pipeline: KanbanPipelineConfig = {
  color: '#713dff',
  isDefault: true,
  key: 'sales',
  name: 'Sales',
  stages: [
    { color: '#0ea5e9', key: 'discovery', name: 'Discovery' },
    { color: '#f59e0b', key: 'proposal', name: 'Proposal' },
    { color: '#22c55e', key: 'closing', name: 'Closing' },
  ],
};

export const opportunities: readonly KanbanItem[] = [];

export function getOpportunity(id: string): KanbanItem | undefined {
  return opportunities.find((opportunity) => opportunity._id === id);
}
