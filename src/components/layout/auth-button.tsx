import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/session';
import { cn } from '@/lib/utils';

interface AuthButtonProps {
  readonly variant?: 'default' | 'landing';
}

export async function AuthButton({
  variant = 'default',
}: AuthButtonProps): Promise<React.ReactElement> {
  const session = await getSession();
  const isLoggedIn = !!session?.user;

  return (
    <Button
      asChild
      className={cn(
        variant === 'landing' &&
          'rounded-full border border-black/8 bg-white/78 px-4 text-[0.95rem] font-medium tracking-[-0.02em] text-[color:var(--landing-ink)] shadow-none hover:bg-white'
      )}
    >
      <Link href={isLoggedIn ? '/dashboard' : '/login'}>
        {isLoggedIn ? 'Dashboard' : 'Sign In'}
      </Link>
    </Button>
  );
}
