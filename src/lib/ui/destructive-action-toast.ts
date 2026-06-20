'use client';

import { createElement } from 'react';
import { toast } from 'sonner';

import { DestructiveActionToastContent } from './destructive-action-toast-content';

import type { ReactNode } from 'react';
import type { ToastT } from 'sonner';

interface DestructiveActionToastOptions {
  readonly message: ReactNode;
  readonly confirmLabel?: ReactNode;
  readonly onConfirm: () => void | Promise<void>;
}

interface NavigatorWithUserAgentData extends Navigator {
  readonly userAgentData?: {
    readonly platform?: string;
  };
}

let activeShortcutToken: symbol | null = null;

function getDesktopShortcutModifierLabel(): string {
  if (typeof globalThis.navigator === 'undefined') {
    return 'Ctrl';
  }

  const navigatorWithUserAgentData = globalThis.navigator as NavigatorWithUserAgentData;
  const platform =
    navigatorWithUserAgentData.userAgentData?.platform ?? globalThis.navigator.userAgent;

  return /Mac|iPhone|iPad|iPod/i.test(platform) ? 'Cmd' : 'Ctrl';
}

function isAllowedConfirmShortcutEvent(
  event: KeyboardEvent,
  desktopModifierLabel: string,
): boolean {
  if (event.key !== 'Enter' || event.repeat || event.isComposing) {
    return false;
  }

  const expectsMetaKey = desktopModifierLabel === 'Cmd';
  const usedExpectedModifier = expectsMetaKey ? event.metaKey : event.ctrlKey;
  const usedOtherModifier = expectsMetaKey ? event.ctrlKey : event.metaKey;

  return usedExpectedModifier && !usedOtherModifier && !event.shiftKey && !event.altKey;
}

function createConfirmShortcutHandler(
  shortcutToken: symbol,
  desktopModifierLabel: string,
  confirm: () => void,
): (event: KeyboardEvent) => void {
  return (event) => {
    if (!isAllowedConfirmShortcutEvent(event, desktopModifierLabel)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (activeShortcutToken === shortcutToken) {
      confirm();
    }
  };
}

export function showDestructiveActionToast({
  message,
  confirmLabel = 'Delete',
  onConfirm,
}: DestructiveActionToastOptions): void {
  const shortcutToken = Symbol('destructive-action-toast');
  const desktopModifierLabel = getDesktopShortcutModifierLabel();
  activeShortcutToken = shortcutToken;
  let didConfirm = false;

  const cleanup = (): void => {
    if (activeShortcutToken === shortcutToken) {
      activeShortcutToken = null;
    }
    globalThis.window.removeEventListener('keydown', handleKeyDown, true);
  };

  const confirm = (event?: { preventDefault: () => void; stopPropagation: () => void }): void => {
    event?.preventDefault();
    event?.stopPropagation();

    if (didConfirm || activeShortcutToken !== shortcutToken) {
      return;
    }

    didConfirm = true;
    cleanup();
    toast.dismiss(toastId);

    Promise.resolve(onConfirm()).catch((error: unknown) => {
      console.error('Destructive action failed:', error);
    });
  };

  const handleKeyDown = createConfirmShortcutHandler(shortcutToken, desktopModifierLabel, confirm);

  globalThis.window.addEventListener('keydown', handleKeyDown, true);

  const toastId = toast.custom(
    () =>
      createElement(DestructiveActionToastContent, {
        confirmLabel,
        desktopModifierLabel,
        message,
        onConfirmClick: confirm,
      }),
    {
      onAutoClose: (_toast: ToastT) => {
        cleanup();
      },
      onDismiss: (_toast: ToastT) => {
        cleanup();
      },
    },
  );
}
