import { FileText, UserPlus } from 'lucide-react';

import type { NotificationTabConfig } from '@carefully-built/saas-kit/notifications';
import { NotificationVisualMeta } from '@carefully-built/saas-kit/notifications';

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
