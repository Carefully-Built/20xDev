import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/session';

export async function AuthButton(): Promise<React.ReactElement> {
  const session = await getSession();
  const isLoggedIn = !!session?.user;

  return (
    <Button asChild>
      <Link href={isLoggedIn ? '/dashboard' : '/login'}>
        {isLoggedIn ? 'Dashboard' : 'Sign In'}
      </Link>
    </Button>
  );
}
