'use client';

import { Download, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Person } from '../_lib';

import { CrmMetricCard } from './crm-metric-card';
import { CrmPageHeader } from './crm-page-header';
import { formatCurrency, getInitials, getPersonStatusClasses } from './crm-utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface PeopleTableProps {
  readonly people: readonly Person[];
}

export function PeopleTable({ people }: PeopleTableProps): React.ReactElement {
  const [search, setSearch] = useState('');

  const filteredPeople = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return people;
    }

    return people.filter((person) =>
      [person.name, person.email, person.company, person.title, person.city, person.owner]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [people, search]);

  const totalValue = useMemo(
    () => filteredPeople.reduce((sum, person) => sum + person.estimatedValue, 0),
    [filteredPeople]
  );

  const activeBuyers = useMemo(
    () => filteredPeople.filter((person) => person.status === 'active buyer').length,
    [filteredPeople]
  );

  const champions = useMemo(
    () => filteredPeople.filter((person) => person.status === 'champion').length,
    [filteredPeople]
  );

  return (
    <div className="space-y-6">
      <CrmPageHeader
        eyebrow="People"
        title="Relationship view built for deal momentum"
        description="Track the people behind every account with a lightweight CRM table focused on contact quality, live opportunities, and next-touch context."
        actions={
          <>
            <Button variant="outline" className="rounded-full">
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button className="rounded-full">
              <Plus className="size-4" />
              New person
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmMetricCard
          label="Contacts"
          value={String(filteredPeople.length)}
          hint="Curated decision-makers and buyer-side operators."
          accentClassName="bg-violet-500"
        />
        <CrmMetricCard
          label="Active Buyers"
          value={String(activeBuyers)}
          hint="People currently moving with at least one warm thread."
          accentClassName="bg-emerald-500"
        />
        <CrmMetricCard
          label="Tracked Value"
          value={formatCurrency(totalValue)}
          hint={`${champions} champions helping deals advance faster.`}
          accentClassName="bg-sky-500"
        />
      </div>

      <Card className="overflow-hidden border-0 py-0 shadow-sm ring-1 ring-black/5">
        <CardContent className="space-y-5 p-0">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                placeholder="Search people, companies, owners..."
                className="h-11 rounded-2xl border-border/80 bg-background pl-9 shadow-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="rounded-full">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <Badge variant="outline" className="h-9 rounded-full px-3 text-sm font-medium">
                {filteredPeople.length} people
              </Badge>
            </div>
          </div>

          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead className="px-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">Person</TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Company</TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Relationship</TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Last touch</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">Open deals</TableHead>
                  <TableHead className="px-5 text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">Estimated value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.map((person) => (
                  <TableRow key={person.id} className="border-border/60">
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                            {getInitials(person.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{person.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{person.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{person.company}</p>
                        <p className="text-sm text-muted-foreground">{person.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset',
                            getPersonStatusClasses(person.status)
                          )}
                        >
                          {person.status}
                        </span>
                        <span className="text-sm text-muted-foreground">{person.owner} · {person.city}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">{person.lastContact}</TableCell>
                    <TableCell className="py-4 text-right font-medium text-foreground">{person.openOpportunities}</TableCell>
                    <TableCell className="px-5 py-4 text-right font-medium text-foreground">
                      {formatCurrency(person.estimatedValue)}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPeople.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">
                      No people match the current search.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
