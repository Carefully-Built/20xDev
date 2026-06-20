export interface Contact {
  readonly id: string;
  readonly name: string;
  readonly company: string;
  readonly role: string;
  readonly owner: string;
  readonly status: 'New' | 'Qualified' | 'Proposal' | 'Customer';
  readonly value: number;
}

export const contacts: readonly Contact[] = [
  {
    company: 'Northstar Studio',
    id: 'contact-1',
    name: 'Maya Chen',
    owner: 'Alessandro',
    role: 'Founder',
    status: 'Proposal',
    value: 42000,
  },
  {
    company: 'Valeo Labs',
    id: 'contact-2',
    name: 'Jon Bell',
    owner: 'Sofia',
    role: 'Operations Lead',
    status: 'Qualified',
    value: 18000,
  },
  {
    company: 'Motive Works',
    id: 'contact-3',
    name: 'Andre Martin',
    owner: 'Elena',
    role: 'CEO',
    status: 'Customer',
    value: 63000,
  },
];
