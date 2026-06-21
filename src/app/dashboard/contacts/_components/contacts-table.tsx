import type { CrudFilterDefinition } from '@carefully-built/saas-kit/crud';
import { Chip, type Column } from '@carefully-built/saas-kit';
import { UserRound, Workflow } from 'lucide-react';

import type { Contact } from './contacts.types';

export const contactStatusLabels: Record<Contact['status'], string> = {
  customer: 'Customer',
  new: 'New',
  proposal: 'Proposal',
  qualified: 'Qualified',
};

export const contactColumns: Column<Contact>[] = [
  { accessor: 'name', header: 'Name' },
  { accessor: 'company', header: 'Company' },
  { accessor: 'role', header: 'Role' },
  {
    accessor: 'status',
    header: 'Status',
    render: (_value, contact) => <Chip>{contactStatusLabels[contact.status]}</Chip>,
  },
  { accessor: 'owner', header: 'Owner' },
];

export const contactStatusFilter: CrudFilterDefinition<Contact> = {
  key: 'status',
  config: {
    key: 'status',
    label: 'Status',
    icon: Workflow,
    options: Object.entries(contactStatusLabels).map(([value, label]) => ({ label, value })),
  },
};

export function buildContactOwnerFilter(
  contacts: readonly Contact[],
): CrudFilterDefinition<Contact> {
  return {
    key: 'owner',
    config: {
      key: 'owner',
      label: 'Owner',
      icon: UserRound,
      options: [
        ...new Set(contacts.flatMap((contact) => (contact.owner ? [contact.owner] : []))),
      ].map((owner) => ({ label: owner, value: owner })),
    },
  };
}
