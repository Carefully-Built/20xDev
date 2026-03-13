'use client';

import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import { ChevronDown, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';


import { CreateOrganization } from './create-organization';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useOrganization } from '@/providers';

interface Organization {
  id: string;
  name: string;
  role: string;
}

interface OrganizationsResponse {
  organizations: Organization[];
}

interface SidebarOrgSwitcherProps {
  readonly collapsed?: boolean;
  readonly onSwitch?: (orgId: string) => void;
}

interface OrgLogoProps {
  readonly orgId: string;
  readonly name: string;
  readonly size?: 'sm' | 'md';
  readonly className?: string;
}

function OrgLogo({ orgId, name, size = 'md', className }: OrgLogoProps): React.ReactElement {
  const orgData = useQuery(api.functions.organizations.queries.getByWorkosId, { workosId: orgId });
  const logoUrl = orgData?.logoUrl ?? null;
  
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  const sizeClasses = size === 'sm' ? 'size-6' : 'size-8';
  const textClasses = size === 'sm' ? 'text-xs' : 'text-xs';

  if (logoUrl) {
    return (
      <div className={cn('relative shrink-0 rounded-md overflow-hidden', sizeClasses, className)}>
        <Image src={logoUrl} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-md bg-primary/10 font-semibold text-primary', sizeClasses, textClasses, className)}>
      {initials}
    </div>
  );
}

export function SidebarOrgSwitcher({ collapsed = false, onSwitch }: SidebarOrgSwitcherProps): React.ReactElement {
  const router = useRouter();
  const { organizationId, setOrganizationId } = useOrganization();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  const fetchOrgs = useCallback((): void => {
    fetch('/api/organizations')
      .then((res) => (res.ok ? res.json() : { organizations: [] }))
      .then((data: OrganizationsResponse) => {
        setOrganizations(data.organizations);
        const matchingOrg = data.organizations.find((o) => o.id === organizationId);
        if (matchingOrg) {
          setCurrentOrg(matchingOrg);
        } else if (data.organizations.length > 0 && data.organizations[0]) {
          setCurrentOrg(data.organizations[0]);
          setOrganizationId(data.organizations[0].id);
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, [organizationId, setOrganizationId]);

  useEffect(() => {
    fetchOrgs();

    const handleOrgUpdate = (): void => {
      fetchOrgs();
    };
    globalThis.addEventListener('org-updated', handleOrgUpdate);
    return (): void => {
      globalThis.removeEventListener('org-updated', handleOrgUpdate);
    };
  }, [fetchOrgs]);

  const handleSwitch = async (org: Organization): Promise<void> => {
    try {
      const response = await fetch('/api/organizations/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: org.id }),
      });

      if (response.ok) {
        setCurrentOrg(org);
        setOrganizationId(org.id);
        onSwitch?.(org.id);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };

  const handleCreated = (orgId: string): void => {
    void fetch('/api/organizations')
      .then((res) => res.json())
      .then((data: OrganizationsResponse) => {
        setOrganizations(data.organizations);
        const newOrg = data.organizations.find((o: Organization) => o.id === orgId);
        if (newOrg) {
          setCurrentOrg(newOrg);
          setOrganizationId(newOrg.id);
        }
      });
    onSwitch?.(orgId);
    router.refresh();
  };

  const dropdownContent = (
    <DropdownMenuContent align={collapsed ? 'center' : 'start'} className="w-56">
      <DropdownMenuLabel>Organizations</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {organizations.map((org) => (
        <DropdownMenuItem
          key={org.id}
          className={cn(currentOrg?.id === org.id && 'bg-accent')}
          onClick={(): void => {
            void handleSwitch(org);
          }}
        >
          <OrgLogo orgId={org.id} name={org.name} size="sm" className="mr-2" />
          <span className="truncate">{org.name}</span>
        </DropdownMenuItem>
      ))}
      {organizations.length === 0 && <DropdownMenuItem disabled>No organizations</DropdownMenuItem>}
      <DropdownMenuSeparator />
      <CreateOrganization onCreated={handleCreated}>
        <DropdownMenuItem
          onSelect={(e): void => {
            e.preventDefault();
          }}
        >
          <Plus className="mr-2 size-4" />
          Create Organization
        </DropdownMenuItem>
      </CreateOrganization>
    </DropdownMenuContent>
  );

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 w-full" size="icon" variant="ghost">
                {currentOrg ? (
                  <OrgLogo orgId={currentOrg.id} name={currentOrg.name} size="md" />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                    O
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{currentOrg?.name ?? 'Organization'}</TooltipContent>
        </Tooltip>
        {dropdownContent}
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 w-full justify-between px-2" variant="ghost">
          <span className="flex min-w-0 items-center gap-2">
            {currentOrg ? (
              <OrgLogo orgId={currentOrg.id} name={currentOrg.name} size="sm" />
            ) : (
              <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
                O
              </div>
            )}
            <span className="truncate text-sm">{currentOrg?.name ?? 'Select Org'}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  );
}
