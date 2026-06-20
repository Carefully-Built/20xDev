import { FileText, UserPlus } from 'lucide-react';

import type { ActivityListItem } from '@carefully-built/agenda';
import type { NotificationTabConfig, NotificationVisualMeta } from '@carefully-built/notifications';

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const dashboardActivities: ActivityListItem[] = [
  {
    _id: 'activity-1',
    activityTypeColor: '#0ea5e9',
    activityTypeId: 'call',
    activityTypeLabel: 'Call',
    associations: [
      {
        entityId: 'opp-1',
        entityType: 'opportunity',
        label: 'Northstar component rollout',
        typeLabel: 'Opportunity',
        value: 'opportunity:opp-1',
      },
    ],
    assignedUserId: 'user-1',
    assignedUserName: 'Alessandro',
    description: 'Review the dashboard foundation and component usage.',
    dueAt: now + 2 * hour,
    endAt: now + 3 * hour,
    participantUserIds: ['user-1'],
    participantUserNames: ['Alessandro'],
    startAt: now + 2 * hour,
    status: 'scheduled',
    title: 'Dashboard review',
    visibility: 'team',
  },
  {
    _id: 'activity-2',
    activityTypeColor: '#14b8a6',
    activityTypeId: 'demo',
    activityTypeLabel: 'Demo',
    associations: [],
    assignedUserId: 'user-2',
    assignedUserName: 'Sofia',
    description: 'Show searchable CRUD, files, notes, and dashboard cards.',
    dueAt: now + day + 4 * hour,
    endAt: now + day + 5 * hour,
    participantUserIds: ['user-1', 'user-2'],
    participantUserNames: ['Alessandro', 'Sofia'],
    startAt: now + day + 4 * hour,
    status: 'scheduled',
    title: 'SaaS kit demo',
    visibility: 'team',
  },
  {
    _id: 'activity-3',
    activityTypeColor: '#f59e0b',
    activityTypeId: 'follow-up',
    activityTypeLabel: 'Follow-up',
    associations: [
      {
        entityId: 'doc-2',
        entityType: 'document',
        label: 'Client upload request',
        typeLabel: 'Document',
        value: 'document:doc-2',
      },
    ],
    assignedUserId: 'user-3',
    assignedUserName: 'Elena',
    dueAt: now + 2 * day,
    participantUserIds: ['user-3'],
    participantUserNames: ['Elena'],
    status: 'todo',
    title: 'Check uploaded files',
    visibility: 'internal',
  },
];

export const notificationTabs: NotificationTabConfig[] = [
  { icon: UserPlus, label: 'Contacts', value: 'people' },
  { icon: FileText, label: 'Files', value: 'files' },
];

export const notificationTypeMeta: Record<string, NotificationVisualMeta> = {
  files: {
    className: 'bg-sky-500/10 text-sky-700',
    icon: FileText,
  },
  people: {
    className: 'bg-cyan-500/10 text-cyan-700',
    icon: UserPlus,
  },
};

export const chartColors = ['#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b'] as const;

export const stageChartData = [
  { label: 'Discovery', value: 1 },
  { label: 'Proposal', value: 1 },
  { label: 'Closing', value: 1 },
];

export const weeklyActivityData = [
  { label: 'Mon', value: 3 },
  { label: 'Tue', value: 6 },
  { label: 'Wed', value: 4 },
  { label: 'Thu', value: 7 },
  { label: 'Fri', value: 5 },
];
