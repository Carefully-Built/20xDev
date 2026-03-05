'use client';

import { useEffect, useState } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps): React.ReactElement => {
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    // Import dynamically since this is the global error boundary
    // and can't rely on providers being available
    import('@/lib/error-handler').then(({ captureError }) => {
      const { errorId } = captureError(error, {
        category: 'unknown',
        severity: 'critical',
        context: {
          metadata: { digest: error.digest, isGlobalError: true },
        },
      });
      setErrorId(errorId);
    }).catch(() => {
      // If error handler fails, generate a simple error ID
      setErrorId(`err_${Date.now()}`);
      console.error('Global error:', error);
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div 
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            backgroundColor: '#09090b',
            color: '#fafafa',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <h1 
            style={{ 
              fontSize: '8rem', 
              fontWeight: 'bold', 
              color: 'rgba(161, 161, 170, 0.3)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            500
          </h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
            Something went wrong
          </h2>
          <p 
            style={{ 
              maxWidth: '28rem', 
              textAlign: 'center', 
              color: '#a1a1aa',
              margin: 0,
            }}
          >
            A critical error occurred. Please try again later.
          </p>
          {errorId && (
            <p style={{ fontSize: '0.75rem', color: 'rgba(161, 161, 170, 0.5)', margin: 0 }}>
              Error ID: {errorId}
            </p>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                border: '1px solid #27272a',
                backgroundColor: 'transparent',
                color: '#fafafa',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#fafafa',
                color: '#09090b',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
