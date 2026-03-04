'use client';

import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { T } from 'gt-next';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AppearanceSection(): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><T>Theme</T></CardTitle>
          <CardDescription>
            <T>Select your preferred theme for the dashboard.</T>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 transition-colors">
              <Sun className="size-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium"><T>Light</T></p>
                <p className="text-xs text-muted-foreground"><T>A clean, bright interface</T></p>
              </div>
            </div>
            <div className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 transition-colors">
              <Moon className="size-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium"><T>Dark</T></p>
                <p className="text-xs text-muted-foreground"><T>Easy on the eyes</T></p>
              </div>
            </div>
            <div className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 transition-colors">
              <Monitor className="size-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium"><T>System</T></p>
                <p className="text-xs text-muted-foreground"><T>Match your device settings</T></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle><T>Theme</T></CardTitle>
        <CardDescription>
          <T>Select your preferred theme for the dashboard.</T>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={cn(
              'relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-primary/50',
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            {theme === 'light' && (
              <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </div>
            )}
            <Sun className={cn('size-8', theme === 'light' ? 'text-primary' : 'text-muted-foreground')} />
            <div className="text-center">
              <p className="font-medium"><T>Light</T></p>
              <p className="text-xs text-muted-foreground"><T>A clean, bright interface</T></p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={cn(
              'relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-primary/50',
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            {theme === 'dark' && (
              <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </div>
            )}
            <Moon className={cn('size-8', theme === 'dark' ? 'text-primary' : 'text-muted-foreground')} />
            <div className="text-center">
              <p className="font-medium"><T>Dark</T></p>
              <p className="text-xs text-muted-foreground"><T>Easy on the eyes</T></p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={cn(
              'relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-primary/50',
              theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            {theme === 'system' && (
              <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </div>
            )}
            <Monitor className={cn('size-8', theme === 'system' ? 'text-primary' : 'text-muted-foreground')} />
            <div className="text-center">
              <p className="font-medium"><T>System</T></p>
              <p className="text-xs text-muted-foreground"><T>Match your device settings</T></p>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
