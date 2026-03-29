'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Person } from '../_lib';

import { formatCurrency, getInitials, getPersonStatusClasses } from './crm-utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  return (
    <div className="space-y-4">
      <div className="rounded-[18px] border border-border/70 bg-card px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">People</h1>
            <span className="rounded-md border border-border bg-muted px-1.5 text-[11px] leading-5 text-muted-foreground">
              {filteredPeople.length}
            </span>
          </div>
          <div className="relative w-full min-w-0 sm:w-[295px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search"
              className="h-8 rounded-[11px] border-border bg-background pl-9 text-[13px] shadow-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-border/70 bg-card shadow-sm">
        <div className="md:hidden">
          {filteredPeople.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No results</div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredPeople.map((person) => (
                <article key={person.id} className="space-y-3 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                          {getInitials(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{person.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{person.email}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium capitalize ring-1 ring-inset',
                        getPersonStatusClasses(person.status)
                      )}
                    >
                      {person.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Company</p>
                      <p className="truncate font-medium text-foreground">{person.company}</p>
                      <p className="truncate text-muted-foreground">{person.title}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Owner</p>
                      <p className="font-medium text-foreground">{person.owner}</p>
                      <p className="text-muted-foreground">{person.city}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last touch</p>
                      <p className="font-medium text-foreground">{person.lastContact}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Open / Value</p>
                      <p className="font-medium text-foreground">
                        {person.openOpportunities} / {formatCurrency(person.estimatedValue)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="border-border/70 hover:bg-transparent">
              <TableHead className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Person</TableHead>
              <TableHead className="py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Company</TableHead>
              <TableHead className="py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Status</TableHead>
              <TableHead className="py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Last touch</TableHead>
              <TableHead className="py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Open</TableHead>
              <TableHead className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPeople.map((person) => (
              <TableRow key={person.id} className="border-border/60">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{person.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{person.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{person.company}</p>
                    <p className="text-xs text-muted-foreground">{person.title}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium capitalize ring-1 ring-inset',
                        getPersonStatusClasses(person.status)
                      )}
                    >
                      {person.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{person.owner}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs text-muted-foreground">{person.lastContact}</TableCell>
                <TableCell className="py-3 text-right text-sm font-medium text-foreground">{person.openOpportunities}</TableCell>
                <TableCell className="px-4 py-3 text-right text-sm font-medium text-foreground">
                  {formatCurrency(person.estimatedValue)}
                </TableCell>
              </TableRow>
            ))}
            {filteredPeople.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No results
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
