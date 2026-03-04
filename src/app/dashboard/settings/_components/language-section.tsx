'use client';

import { Check } from 'lucide-react';
import { useLocale, useSetLocale } from 'gt-next/client';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const languages = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    id: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
  },
] as const;

export function LanguageSection(): React.ReactElement {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language for the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 transition-colors"
              >
                <span className="text-4xl">{lang.flag}</span>
                <div className="text-center">
                  <p className="font-medium">{lang.nativeName}</p>
                  <p className="text-xs text-muted-foreground">{lang.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>Select your preferred language for the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setLocale(lang.id)}
              className={cn(
                'relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-primary/50',
                locale === lang.id ? 'border-primary bg-primary/5' : 'border-muted'
              )}
            >
              {locale === lang.id && (
                <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}
              <span className="text-4xl">{lang.flag}</span>
              <div className="text-center">
                <p className="font-medium">{lang.nativeName}</p>
                <p className="text-xs text-muted-foreground">{lang.name}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
