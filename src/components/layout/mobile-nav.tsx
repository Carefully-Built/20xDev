'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { NavItem } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileNavProps {
  readonly items: readonly NavItem[];
}

export function MobileNav({ items }: MobileNavProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-screen max-w-none rounded-none border-r bg-white text-foreground sm:max-w-none"
      >
        <SheetHeader className="border-b bg-white">
          <SheetTitle className="text-left">20x Step</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 bg-white px-4 py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => {
                setOpen(false);
              }}
            >
              {item.title}
            </Link>
          ))}
          <div className="mt-4 border-t pt-4">
            <Button
              asChild
              className="w-full"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
