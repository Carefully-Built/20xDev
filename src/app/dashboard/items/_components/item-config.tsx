'use client';

import type { Column } from '@/components/shared/SmartTable';
import type { FilterConfig } from '@/components/shared/TableToolbar';
import type { Id } from '@convex/_generated/dataModel';

import {
  ITEM_PRIORITY_CONFIG,
  ITEM_PRIORITY_OPTIONS,
  ITEM_STATUS_CONFIG,
  ITEM_STATUS_OPTIONS,
  type ItemPriority,
  type ItemStatus,
} from '@/lib/filters';

export interface ItemRow extends Record<string, unknown> {
  _id: Id<'items'>;
  name: string;
  description?: string;
  status: ItemStatus;
  priority: ItemPriority;
  createdAt: number;
}

export const statusFilter: FilterConfig<ItemStatus> = {
  key: 'status',
  label: 'Status',
  options: ITEM_STATUS_OPTIONS,
};

export const priorityFilter: FilterConfig<ItemPriority> = {
  key: 'priority',
  label: 'Priority',
  options: ITEM_PRIORITY_OPTIONS,
};

export const itemColumns: Column<ItemRow>[] = [
  { header: 'Name', accessor: 'name', width: '30%' },
  { header: 'Description', accessor: 'description', hideOnMobile: true },
  {
    header: 'Status',
    accessor: 'status',
    render: (value): React.ReactElement => {
      const config = ITEM_STATUS_CONFIG[value as ItemStatus];
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.bgColor}`}>{config.label}</span>;
    },
  },
  {
    header: 'Priority',
    accessor: 'priority',
    hideOnMobile: true,
    render: (value): React.ReactElement => {
      const config = ITEM_PRIORITY_CONFIG[value as ItemPriority];
      return <span className={`font-medium ${config.color}`}>{config.label}</span>;
    },
  },
];
