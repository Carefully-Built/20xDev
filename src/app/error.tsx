'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps): React.ReactElement => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-9xl font-bold text-muted-foreground/30">500</h1>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-muted-foreground">
        An unexpected error occurred. Please try again later.
      </p>
      <div className="mt-4 flex gap-3">
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
