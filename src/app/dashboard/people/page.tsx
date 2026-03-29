'use client';

import { PeopleTable } from '../crm/_components/people-table';
import { mockPeople } from '../crm/_lib';

export default function PeoplePage(): React.ReactElement {
  return <PeopleTable people={mockPeople} />;
}
