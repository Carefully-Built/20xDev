'use client';

import { captureApiError, captureError } from '@carefully-built/resource-kit';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function TestErrorPage(): React.ReactElement {
  const [lastError, setLastError] = useState<{ userMessage: string; errorId: string } | null>(null);

  const triggerClientError = (): void => {
    try {
      throw new Error('Test client-side error from 20xdev');
    } catch (error) {
      const result = captureError(error, {
        category: 'unknown',
        severity: 'medium',
        context: {
          component: 'TestErrorPage',
          action: 'triggerClientError',
        },
      });
      setLastError(result);
    }
  };

  const triggerApiError = (): void => {
    const result = captureApiError(new Error('Simulated API failure'), '/api/test', 'POST', 500);
    setLastError(result);
  };

  const triggerUnhandledError = (): void => {
    // This will be caught by the error boundary
    throw new Error('Unhandled error - should trigger error boundary');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Error Handler Test</h1>
      <p className="text-muted-foreground">Use these buttons to test the error tracking system</p>

      <div className="flex flex-wrap gap-4">
        <Button onClick={triggerClientError} variant="outline">
          Trigger Client Error
        </Button>
        <Button onClick={triggerApiError} variant="outline">
          Trigger API Error
        </Button>
        <Button onClick={triggerUnhandledError} variant="destructive">
          Trigger Unhandled Error (500 page)
        </Button>
      </div>

      {lastError && (
        <div className="border-border bg-card rounded-lg border p-6 text-center">
          <p className="text-muted-foreground text-sm">User sees:</p>
          <p className="font-medium">{lastError.userMessage}</p>
          <p className="text-muted-foreground mt-2 text-xs">Error ID: {lastError.errorId}</p>
          <p className="mt-4 text-xs text-green-600">
            Error captured with a safe user-facing message.
          </p>
        </div>
      )}

      <div className="text-muted-foreground max-w-md text-center text-sm">
        <p>Errors are captured centrally, but users only see a generic message.</p>
      </div>
    </div>
  );
}
