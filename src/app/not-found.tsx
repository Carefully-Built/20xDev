import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NotFoundPage = (): React.ReactElement => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
    <h2 className="text-2xl font-semibold">Page not found</h2>
    <p className="max-w-md text-center text-muted-foreground">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <Button asChild className="mt-4">
      <Link href="/">Go Home</Link>
    </Button>
  </div>
);

export default NotFoundPage;
