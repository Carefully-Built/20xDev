'use client';

import {
  CommandPalette,
  type CommandPaletteTypeOption,
} from '@carefully-built/saas-kit/search/command-palette';
import {
  Bell,
  Files,
  KanbanSquare,
  LayoutDashboard,
  StickyNote,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useContactsByOrganization } from '@/hooks/use-contacts';
import { useFilesByOrganization } from '@/hooks/use-files';
import { useNotificationsByOrganization } from '@/hooks/use-notifications';
import { useOrganization } from '@/providers';

import { bottomNavItems, navItems } from './dashboard-navigation';

type SearchType = 'all' | 'page' | 'contact' | 'opportunity' | 'file' | 'note' | 'notification';

interface SearchItem {
  readonly id: string;
  readonly type: SearchType;
  readonly label: string;
  readonly meta: string;
  readonly href: string;
}

interface DashboardSearchProps {
  readonly isCollapsed: boolean;
  readonly isMobile: boolean;
  readonly onNavigate: () => void;
  readonly triggerVariant: 'sidebar' | 'bottom-nav';
}

const searchTypeOptions: readonly CommandPaletteTypeOption<SearchType>[] = [
  { label: 'All', value: 'all' },
  { icon: <LayoutDashboard className="size-3.5" />, label: 'Pages', value: 'page' },
  { icon: <UsersRound className="size-3.5" />, label: 'Contacts', value: 'contact' },
  { icon: <KanbanSquare className="size-3.5" />, label: 'Opportunities', value: 'opportunity' },
  { icon: <Files className="size-3.5" />, label: 'Files', value: 'file' },
  { icon: <StickyNote className="size-3.5" />, label: 'Notes', value: 'note' },
  { icon: <Bell className="size-3.5" />, label: 'Notifications', value: 'notification' },
];

const searchItemTypeMeta: Record<
  SearchType,
  { readonly color: string; readonly icon: LucideIcon }
> = {
  all: { color: '#64748b', icon: LayoutDashboard },
  contact: { color: '#16a34a', icon: UsersRound },
  file: { color: '#7c3aed', icon: Files },
  note: { color: '#0d9488', icon: StickyNote },
  notification: { color: '#dc2626', icon: Bell },
  opportunity: { color: '#f59e0b', icon: KanbanSquare },
  page: { color: '#2563eb', icon: LayoutDashboard },
};

function getStaticSearchItems(): SearchItem[] {
  return [
    ...navItems.map((item) => ({
      href: item.href,
      id: `page-${item.key}`,
      label: typeof item.label === 'string' ? item.label : item.key,
      meta: 'Page',
      type: 'page' as const,
    })),
    ...bottomNavItems.map((item) => ({
      href: item.href,
      id: `page-${item.key}`,
      label: typeof item.label === 'string' ? item.label : item.key,
      meta: 'Page',
      type: 'page' as const,
    })),
  ];
}

function useDashboardSearchItems(): SearchItem[] {
  const { organizationId } = useOrganization();
  const contacts = useContactsByOrganization(organizationId, 20);
  const files = useFilesByOrganization(organizationId);
  const notifications = useNotificationsByOrganization(organizationId);

  return [
    ...getStaticSearchItems(),
    ...(contacts ?? []).map((contact) => ({
      href: `/dashboard/contacts/${contact._id}`,
      id: contact._id,
      label: contact.name,
      meta: contact.company,
      type: 'contact' as const,
    })),
    ...(files ?? []).map((file) => ({
      href: '/dashboard/files',
      id: String(file._id),
      label: file.name,
      meta: 'File',
      type: 'file' as const,
    })),
    ...(notifications ?? []).map((notification) => ({
      href: notification.href ?? '/dashboard/notifications',
      id: notification.id,
      label: notification.title,
      meta: notification.typeLabel,
      type: 'notification' as const,
    })),
  ];
}

export function DashboardSearch({
  isCollapsed,
  isMobile,
  onNavigate,
  triggerVariant,
}: DashboardSearchProps): React.ReactElement {
  const router = useRouter();
  const searchItems = useDashboardSearchItems();

  return (
    <CommandPalette
      activeAllType="all"
      getItemKey={(item) => item.id}
      getItemLabel={(item) => item.label}
      getItemMeta={(item) => ({
        icon: searchItemTypeMeta[item.type].icon,
        iconColor: searchItemTypeMeta[item.type].color,
        label: item.meta,
      })}
      getItemSearchText={(item) => `${item.label} ${item.meta} ${item.type}`}
      getItemType={(item) => item.type}
      isCollapsed={isCollapsed}
      isMobile={isMobile}
      items={searchItems}
      onSelect={(item) => {
        router.push(item.href);
        onNavigate();
      }}
      placeholder="Search pages and records..."
      title="Search workspace"
      triggerLabel="Search"
      triggerTooltip="Search"
      triggerVariant={triggerVariant}
      typeOptions={searchTypeOptions}
    />
  );
}
