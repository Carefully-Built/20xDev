import Link from 'next/link';

import type { NavItem } from '@/types';

import { cn } from '@/lib/utils';

interface MainNavProps {
  readonly items: readonly NavItem[];
  readonly className?: string;
  readonly variant?: 'default' | 'landing';
}

export function MainNav({
  items,
  className,
  variant = 'default',
}: MainNavProps): React.ReactElement {
  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors',
            variant === 'landing'
              ? 'text-[0.95rem] font-normal tracking-[-0.02em] text-black/58 hover:text-black'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
