'use client';

import { DesktopConfirmShortcutHint } from '@carefully-built/ui';
import { createElement } from 'react';

import type { ReactElement, ReactNode } from 'react';

interface DestructiveActionToastActionLabelProps {
  readonly confirmLabel: ReactNode;
  readonly desktopModifierLabel: string;
}

interface DestructiveActionToastContentProps extends DestructiveActionToastActionLabelProps {
  readonly message: ReactNode;
  readonly onConfirmClick: (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => void;
}

function DestructiveActionToastActionLabel({
  confirmLabel,
  desktopModifierLabel,
}: DestructiveActionToastActionLabelProps): ReactElement {
  return createElement(
    'span',
    { className: 'inline-flex items-center gap-1.5' },
    confirmLabel,
    createElement(DesktopConfirmShortcutHint, { desktopModifierLabel }),
  );
}

export function DestructiveActionToastContent({
  confirmLabel,
  desktopModifierLabel,
  message,
  onConfirmClick,
}: DestructiveActionToastContentProps): ReactElement {
  return createElement(
    'div',
    {
      className:
        'bg-background text-foreground ring-border flex min-w-72 items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-lg ring-1',
    },
    createElement('span', { className: 'min-w-0 truncate font-medium' }, message),
    createElement(
      'button',
      {
        className:
          'bg-destructive text-destructive-foreground inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium shadow-sm transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:outline-none',
        onClick: onConfirmClick,
        type: 'button',
      },
      createElement(DestructiveActionToastActionLabel, {
        confirmLabel,
        desktopModifierLabel,
      }),
    ),
  );
}
