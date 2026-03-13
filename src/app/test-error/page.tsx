'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { captureError, captureApiError } from '@/lib/error-handler';

export default function TestErrorPage() {
  const [lastError, setLastError] = useState<{ userMessage: string; errorId: string } | null>(null);

  const triggerClientError = () => {
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

  const triggerApiError = () => {
    const result = captureApiError(
      new Error('Simulated API failure'),
      '/api/test',
      'POST',
      500
    );
    setLastError(result);
  };

  const triggerUnhandledError = () => {
    // This will be caught by the error boundary
    throw new Error('Unhandled error - should trigger error boundary');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">PostHog Error Test</h1>
      <p className="text-muted-foreground">
        Usa questi pulsanti per testare il sistema di error tracking
      </p>

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
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">User sees:</p>
          <p className="font-medium">{lastError.userMessage}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Error ID: {lastError.errorId}
          </p>
          <p className="mt-4 text-xs text-green-600">
            ✅ Error logged to PostHog (check dashboard)
          </p>
        </div>
      )}

      <div className="max-w-md text-center text-sm text-muted-foreground">
        <p>
          Gli errori vengono inviati a PostHog ma l&apos;utente vede solo un messaggio generico.
        </p>
        <p className="mt-2">
          Dashboard: <a href="https://us.posthog.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">us.posthog.com</a>
        </p>
      </div>
    </div>
  );
}
