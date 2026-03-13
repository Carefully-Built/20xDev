'use client';

import { Plus } from 'lucide-react';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';


type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

interface ResponsiveButtonProps extends Omit<ButtonProps, 'children'> {
  /** Text to display on desktop */
  readonly desktopLabel: ReactNode;
  /** Text to display on mobile */
  readonly mobileLabel: ReactNode;
  /** Custom icon (defaults to Plus) */
  readonly icon?: ReactNode;
  /** Hide icon on mobile */
  readonly hideIconOnMobile?: boolean;
}

export function ResponsiveButton({
  desktopLabel,
  mobileLabel,
  icon,
  hideIconOnMobile = false,
  variant = 'default',
  ...buttonProps
}: ResponsiveButtonProps): React.ReactElement {
  const isMobile = useIsMobile();
  const showIcon = !isMobile || !hideIconOnMobile;
  const defaultIcon = <Plus className="size-4" />;

  return (
    <Button variant={variant} {...buttonProps}>
      {showIcon && (
        <span className="mr-2 shrink-0">
          {icon ?? defaultIcon}
        </span>
      )}
      {isMobile ? mobileLabel : desktopLabel}
    </Button>
  );
}
