'use client';

import { Globe } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const locales = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'it', label: 'Italiano', short: 'IT' },
] as const;

export function LocaleSwitcher(): React.ReactElement {
  const [currentLocale, setLocale] = useState('en');

  const current = locales.find((l) => l.code === currentLocale) ?? locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5" data-testid="locale-switcher">
          <Globe className="size-4" />
          <span className="text-xs font-medium">{current.short}</span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => setLocale(locale.code)}
            className={currentLocale === locale.code ? 'bg-accent' : ''}
          >
            <span className="text-sm">{locale.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">{locale.short}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
