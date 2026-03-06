import { T } from 'gt-next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const NotFoundPage = (): React.ReactElement => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
    <h2 className="text-2xl font-semibold"><T id="notFound.title">Page not found</T></h2>
    <p className="max-w-md text-center text-muted-foreground">
      <T id="notFound.description">The page you&apos;re looking for doesn&apos;t exist or has been moved.</T>
    </p>
    <Button asChild className="mt-4">
      <Link href="/"><T id="notFound.goHome">Go Home</T></Link>
    </Button>
  </div>
);

export default NotFoundPage;
