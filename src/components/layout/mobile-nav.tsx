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
import { siteConfig } from '@/config/site';

interface MobileNavProps {
  readonly items: readonly NavItem[];
  readonly variant?: 'default' | 'landing';
}

function getMobileNavClasses(variant: 'default' | 'landing'): {
  trigger: string;
  content?: string;
  link: string;
  button: string;
} {
  return {
    trigger: variant === 'landing' ? 'rounded-full md:hidden' : 'md:hidden',
    content: variant === 'landing' ? 'border-black/10 bg-[color:var(--landing-surface)]' : undefined,
    link: variant === 'landing'
      ? 'text-sm font-medium text-black/65 transition-colors hover:text-black'
      : 'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
    button: variant === 'landing'
      ? 'w-full rounded-full border border-black/8 bg-white text-[color:var(--landing-ink)] hover:bg-white/90'
      : 'w-full',
  };
}

export function MobileNav({
  items,
  variant = 'default',
}: MobileNavProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const classes = getMobileNavClasses(variant);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={classes.trigger}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={classes.content}>
        <SheetHeader>
          <SheetTitle className="text-left">{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 px-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classes.link}
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
              className={classes.button}
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
