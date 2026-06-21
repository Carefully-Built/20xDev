import type { NavigationItem } from '@carefully-built/saas-kit/app-shell';
import {
  Bell,
  CalendarDays,
  Files,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  StickyNote,
  UsersRound,
} from 'lucide-react';

export const navItems: readonly NavigationItem[] = [
  {
    activeMatch: 'exact',
    href: '/dashboard',
    icon: LayoutDashboard,
    key: 'overview',
    label: 'Overview',
  },
  {
    activeMatch: 'prefix',
    activePaths: ['/dashboard/contacts'],
    href: '/dashboard/contacts',
    icon: UsersRound,
    key: 'contacts',
    label: 'Contacts',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/opportunities',
    icon: KanbanSquare,
    key: 'pipeline',
    label: 'Pipeline',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/files',
    icon: Files,
    key: 'files',
    label: 'Files',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/notes',
    icon: StickyNote,
    key: 'notes',
    label: 'Notes',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/calendar',
    icon: CalendarDays,
    key: 'calendar',
    label: 'Calendar',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/notifications',
    icon: Bell,
    key: 'notifications',
    label: 'Notifications',
  },
];

export const bottomNavItems: readonly NavigationItem[] = [
  {
    activeMatch: 'prefix',
    href: '/dashboard/settings',
    icon: Settings,
    key: 'settings',
    label: 'Settings',
  },
];
