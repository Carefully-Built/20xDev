'use client';

import { SettingsSectionCard } from '@carefully-built/saas-kit/settings-ui';
import { ThemeSelector, type ThemeMode } from '@carefully-built/saas-kit/theme-ui';
import { useTheme } from 'next-themes';

function resolveThemeMode(theme: string | undefined): ThemeMode {
  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    return theme;
  }

  return 'system';
}

export function ThemeSettings(): React.ReactElement {
  const { setTheme, theme } = useTheme();

  return (
    <SettingsSectionCard title="Theme">
      <ThemeSelector
        value={resolveThemeMode(theme)}
        onChange={(nextTheme) => {
          setTheme(nextTheme);
        }}
      />
    </SettingsSectionCard>
  );
}
