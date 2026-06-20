import type { KanbanItem, KanbanPipelineConfig } from '@carefully-built/kanban';

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

export const opportunities: readonly KanbanItem[] = [
  {
    _id: 'opp-1',
    assignedUserName: 'Alessandro',
    associations: [
      {
        entityId: 'contact-1',
        entityType: 'contact',
        label: 'Maya Chen',
        typeLabel: 'Contact',
        value: 'contact-1',
      },
    ],
    notes: 'Wants a CLI-generated dashboard starter with editable component code.',
    pipelineKey: 'sales',
    stageKey: 'discovery',
    status: 'open',
    title: 'Northstar component rollout',
    value: 42000,
  },
  {
    _id: 'opp-2',
    assignedUserName: 'Sofia',
    associations: [
      {
        entityId: 'contact-2',
        entityType: 'contact',
        label: 'Jon Bell',
        typeLabel: 'Contact',
        value: 'contact-2',
      },
    ],
    notes: 'Needs import flows, people tables, and role-aware CRUD examples.',
    pipelineKey: 'sales',
    stageKey: 'proposal',
    status: 'open',
    title: 'Valeo CRM migration',
    value: 18000,
  },
  {
    _id: 'opp-3',
    assignedUserName: 'Elena',
    associations: [
      {
        entityId: 'contact-3',
        entityType: 'contact',
        label: 'Andre Martin',
        typeLabel: 'Contact',
        value: 'contact-3',
      },
    ],
    notes: 'Approved. Use this as the compact “done well” example.',
    pipelineKey: 'sales',
    stageKey: 'closing',
    status: 'won',
    title: 'Motive Works launch',
    value: 63000,
  },
];

export function getOpportunity(id: string): KanbanItem | undefined {
  return opportunities.find((opportunity) => opportunity._id === id);
}
