'use client';

import { LocaleSelector } from 'gt-next/client';

import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  readonly className?: string;
}

/**
 * Language switcher backed by gt-next's <LocaleSelector>.
 *
 * Lists the supported locales from `gt.config.json` (via the GTProvider context)
 * and, on change, persists the choice in the `generaltranslation.locale` cookie
 * and re-renders in the new locale. The cookie then takes priority over the
 * browser's `Accept-Language` on later requests. <LocaleSelector> renders null
 * when fewer than two locales are configured, so this is a no-op for a
 * single-locale fork.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps): React.ReactElement {
  return (
    <LocaleSelector
      aria-label="Select language"
      className={cn(
        'h-9 rounded-md border border-input bg-transparent px-2 text-sm text-muted-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
    />
  );
}
