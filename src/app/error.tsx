'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps): React.ReactElement => {
  useEffect(() => {
    Sentry.captureException(error);
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-9xl font-bold text-muted-foreground/30">500</h1>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-muted-foreground">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="mt-4 flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
      {error.digest ? (
        <p className="mt-4 text-xs text-muted-foreground">Error ID: {error.digest}</p>
      ) : null}
    </div>
  );
};

export default ErrorPage;
