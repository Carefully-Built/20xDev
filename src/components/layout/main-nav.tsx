import Link from 'next/link';

import type { NavItem } from '@/types';

import { cn } from '@/lib/utils';

interface MainNavProps {
  readonly items: readonly NavItem[];
  readonly className?: string;
}

export function MainNav({ items, className }: MainNavProps): React.ReactElement {
  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
