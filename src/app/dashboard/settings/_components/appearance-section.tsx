'use client';

import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const themes = [
  {
    id: 'light',
    name: 'Light',
    description: 'A clean, bright interface',
    icon: Sun,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
  },
  {
    id: 'system',
    name: 'System',
    description: 'Match your device settings',
    icon: Monitor,
  },
] as const;

export function AppearanceSection(): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Select your preferred theme for the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((t) => (
              <div
                key={t.id}
                className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 transition-colors"
              >
                <t.icon className="size-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
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
        <CardTitle>Theme</CardTitle>
        <CardDescription>Select your preferred theme for the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                'relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-primary/50',
                theme === t.id ? 'border-primary bg-primary/5' : 'border-muted'
              )}
            >
              {theme === t.id && (
                <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}
              <t.icon className={cn('size-8', theme === t.id ? 'text-primary' : 'text-muted-foreground')} />
              <div className="text-center">
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
