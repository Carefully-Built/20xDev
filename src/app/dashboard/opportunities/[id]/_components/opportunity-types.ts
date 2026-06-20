import type { KanbanItem, KanbanStatus } from '@carefully-built/kanban';

export type OpportunityDetailTab = 'overview' | 'notes' | 'documents' | 'activity';

export interface OpportunityFormValues {
  readonly assignedUserName: string;
  readonly notes: string;
  readonly stageKey: string;
  readonly status: KanbanStatus;
  readonly title: string;
  readonly value: string;
}

export type EditableOpportunity = KanbanItem;
