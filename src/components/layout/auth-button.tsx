'use client';

import { T } from 'gt-next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/providers';

interface AuthButtonProps {
  readonly variant?: 'default' | 'landing';
}

export function AuthButton({ variant = 'default' }: AuthButtonProps): React.ReactElement {
  const { user } = useUser();
  const isLoggedIn = !!user;

  return (
    <Button
      asChild
      className={cn(
        variant === 'landing' &&
          'rounded-full border border-black/8 bg-white/78 px-4 text-[0.95rem] font-medium tracking-[-0.02em] text-[color:var(--landing-ink)] shadow-none hover:bg-white',
      )}
    >
      <Link href="/dashboard">
        {isLoggedIn ? <T>Dashboard</T> : <T>Sign In</T>}
      </Link>
    </Button>
  );
}
