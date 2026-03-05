'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { captureError } from '@/lib/error-handler';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps): React.ReactElement => {
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    // Capture error to PostHog (never expose to user)
    const { errorId } = captureError(error, {
      category: 'unknown',
      severity: 'high',
      context: {
        metadata: { digest: error.digest },
      },
    });
    setErrorId(errorId);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-9xl font-bold text-muted-foreground/30">500</h1>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-muted-foreground">
        An unexpected error occurred. Please try again later.
      </p>
      {errorId && (
        <p className="text-xs text-muted-foreground/50">
          Error ID: {errorId}
        </p>
      )}
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
