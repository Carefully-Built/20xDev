'use client';

import { ChevronDown, MoreHorizontal, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Opportunity, OpportunityStage } from '../_lib';

import { CrmMetricCard } from './crm-metric-card';
import { CrmPageHeader } from './crm-page-header';
import { formatCurrency } from './crm-utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockPeople, opportunityStages } from '../_lib';

interface OpportunityBoardProps {
  readonly opportunities: readonly Opportunity[];
}

export function OpportunityBoard({ opportunities }: OpportunityBoardProps): React.ReactElement {
  const [search, setSearch] = useState('');

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return opportunities;
    }

    return opportunities.filter((opportunity) =>
      [opportunity.title, opportunity.company, opportunity.contactName, opportunity.owner]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [opportunities, search]);

  const pipelineValue = useMemo(
    () => filteredOpportunities
      .filter((opportunity) => opportunity.stage !== 'lost')
      .reduce((sum, opportunity) => sum + opportunity.amount, 0),
    [filteredOpportunities]
  );

  const winRate = useMemo(() => {
    const closed = filteredOpportunities.filter(
      (opportunity) => opportunity.stage === 'won' || opportunity.stage === 'lost'
    );

    if (closed.length === 0) {
      return '0%';
    }

    const won = closed.filter((opportunity) => opportunity.stage === 'won').length;
    return `${Math.round((won / closed.length) * 100)}%`;
  }, [filteredOpportunities]);

  const activeContacts = useMemo(() => {
    const names = new Set(
      filteredOpportunities
        .filter((opportunity) => opportunity.stage !== 'lost')
        .map((opportunity) => opportunity.contactName)
    );

    return names.size;
  }, [filteredOpportunities]);

  const groupedOpportunities = useMemo(() => {
    return opportunityStages.map((stage) => ({
      ...stage,
      items: filteredOpportunities.filter((opportunity) => opportunity.stage === stage.id),
    }));
  }, [filteredOpportunities]);

  return (
    <div className="space-y-6">
      <CrmPageHeader
        eyebrow="Opportunities"
        title="A compact pipeline with clear deal energy"
        description="The board follows the Figma reference: quiet controls, dense columns, and compact cards that keep stage counts and value legible without turning the page into a bulky sales dashboard."
        actions={
          <>
            <Button variant="outline" className="rounded-full">
              Pipeline 1
              <Badge variant="outline" className="ml-1 h-5 rounded-md px-1.5 text-[11px]">
                {groupedOpportunities.length}
              </Badge>
              <ChevronDown className="size-4" />
            </Button>
            <Button className="rounded-full">
              <Plus className="size-4" />
              New opportunity
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmMetricCard
          label="Pipeline Value"
          value={formatCurrency(pipelineValue)}
          hint="Open opportunities currently in motion."
          accentClassName="bg-violet-500"
        />
        <CrmMetricCard
          label="Win Rate"
          value={winRate}
          hint="Closed outcomes tracked directly on the board."
          accentClassName="bg-emerald-500"
        />
        <CrmMetricCard
          label="Active Contacts"
          value={String(activeContacts)}
          hint={`${mockPeople.length} people available in the CRM roster.`}
          accentClassName="bg-orange-500"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search pipeline"
            className="h-11 rounded-2xl border-border/80 bg-background pl-9 shadow-none"
          />
        </div>
        <Button variant="outline" className="w-fit rounded-full">
          Pipeline 1
          <Badge variant="outline" className="h-5 rounded-md px-1.5 text-[11px]">
            {filteredOpportunities.length}
          </Badge>
          <ChevronDown className="size-4" />
        </Button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {groupedOpportunities.map((stage) => (
            <section key={stage.id} className="w-[280px] shrink-0 space-y-3">
              <div className="flex items-center gap-2 px-2">
                <span className={cn('size-3 rounded-full', stage.dotClassName)} />
                <p className="font-semibold tracking-tight text-foreground">{stage.label}</p>
                <Badge variant="outline" className="h-5 rounded-md px-1.5 text-[11px]">
                  {stage.items.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {stage.items.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} stage={stage.id} />
                ))}
                {stage.items.length === 0 ? (
                  <Card className="border border-dashed border-border/80 bg-muted/20 py-0 shadow-none ring-0">
                    <CardContent className="p-6 text-center text-sm text-muted-foreground">
                      No opportunities in this stage.
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  readonly opportunity: Opportunity;
  readonly stage: OpportunityStage;
}

function OpportunityCard({ opportunity, stage }: OpportunityCardProps): React.ReactElement {
  const stageMeta = opportunityStages.find((item) => item.id === stage);

  return (
    <Card className="border-0 bg-card py-0 shadow-sm ring-1 ring-black/5">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium leading-5 text-foreground underline decoration-border underline-offset-4">
              {opportunity.title}
            </p>
            <p className="text-sm text-muted-foreground">{opportunity.company}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback className="bg-orange-100 text-[10px] font-semibold text-orange-700">
                {opportunity.contactInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{opportunity.contactName}</p>
              <p className="truncate text-xs text-muted-foreground">{opportunity.owner}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">{formatCurrency(opportunity.amount)}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset',
              stageMeta?.badgeClassName
            )}
          >
            {stageMeta?.label ?? stage}
          </span>
          <p className="text-xs text-muted-foreground">{opportunity.updatedAt}</p>
        </div>
      </CardContent>
    </Card>
  );
}
