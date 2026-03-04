'use client';

import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { T, useGT } from 'gt-next';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const themes = [
  {
    id: 'light',
    nameKey: 'Light',
    descriptionKey: 'A clean, bright interface',
    icon: Sun,
  },
  {
    id: 'dark',
    nameKey: 'Dark',
    descriptionKey: 'Easy on the eyes',
    icon: Moon,
  },
  {
    id: 'system',
    nameKey: 'System',
    descriptionKey: 'Match your device settings',
    icon: Monitor,
  },
] as const;

export function AppearanceSection(): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const t = useGT();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><T>Theme</T></CardTitle>
          <CardDescription><T>Select your preferred theme for the dashboard.</T></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 transition-colors"
              >
                <themeOption.icon className="size-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">{t(themeOption.nameKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(themeOption.descriptionKey)}</p>
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
        <CardTitle><T>Theme</T></CardTitle>
        <CardDescription><T>Select your preferred theme for the dashboard.</T></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              type="button"
              onClick={() => setTheme(themeOption.id)}
              className={cn(
                'relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-primary/50',
                theme === themeOption.id ? 'border-primary bg-primary/5' : 'border-muted'
              )}
            >
              {theme === themeOption.id && (
                <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}
              <themeOption.icon className={cn('size-8', theme === themeOption.id ? 'text-primary' : 'text-muted-foreground')} />
              <div className="text-center">
                <p className="font-medium">{t(themeOption.nameKey)}</p>
                <p className="text-xs text-muted-foreground">{t(themeOption.descriptionKey)}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
