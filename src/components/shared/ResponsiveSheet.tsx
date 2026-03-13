'use client';

import type { ReactNode } from 'react';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


interface ResponsiveSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: ReactNode;
  readonly children: ReactNode;
  readonly width?: number;
}

export function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  children,
  width = 550,
}: ResponsiveSheetProps): React.ReactElement {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-auto">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        style={{ width: `${String(width)}px`, maxWidth: '85vw' }}
        className="flex flex-col gap-0 p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto overflow-x-visible -mx-6 px-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
