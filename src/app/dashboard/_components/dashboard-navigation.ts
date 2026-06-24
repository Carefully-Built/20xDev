import type { NavigationGroup, NavigationItem } from '@carefully-built/saas-kit/app-shell';
import {
  Bell,
  CalendarDays,
  Files,
  KanbanSquare,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Rocket,
  Send,
  Settings,
  StickyNote,
  UsersRound,
} from 'lucide-react';

const channelNavItems: readonly NavigationItem[] = [
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

const addonNavItems: readonly NavigationItem[] = [
  {
    activeMatch: 'prefix',
    href: '/dashboard/editorial-boosting',
    icon: Rocket,
    key: 'editorial-boosting',
    label: 'Editorial Boosting',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/directory-submission',
    icon: Send,
    key: 'directory-submission',
    label: 'Directory Submission',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/guest-blog-posting',
    icon: Newspaper,
    key: 'guest-blog-posting',
    label: 'Guest Blog Posting',
  },
  {
    activeMatch: 'prefix',
    href: '/dashboard/rno30-lift',
    icon: Megaphone,
    key: 'rno30-lift',
    label: 'RNO30 Lift',
  },
];

export const navItems: readonly NavigationItem[] = [...channelNavItems, ...addonNavItems];

export const navGroups: readonly NavigationGroup[] = [
  {
    defaultOpen: true,
    items: channelNavItems,
    key: 'channel',
    label: 'Channel',
  },
  {
    collapsible: true,
    defaultOpen: false,
    items: addonNavItems,
    key: 'addons',
    label: 'Add-ons',
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
