export type PersonStatus = 'active buyer' | 'nurturing' | 'champion' | 'at risk';

export interface Person {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly title: string;
  readonly city: string;
  readonly owner: string;
  readonly status: PersonStatus;
  readonly lastContact: string;
  readonly openOpportunities: number;
  readonly estimatedValue: number;
}

export type OpportunityStage = 'qualified' | 'proposal' | 'won' | 'lost';

export interface Opportunity {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly contactName: string;
  readonly contactInitials: string;
  readonly owner: string;
  readonly amount: number;
  readonly updatedAt: string;
  readonly stage: OpportunityStage;
}

export interface OpportunityStageDefinition {
  readonly id: OpportunityStage;
  readonly label: string;
  readonly dotClassName: string;
  readonly badgeClassName: string;
}
