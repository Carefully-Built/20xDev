'use client';

import { SaasErrorPage } from '@carefully-built/saas-kit';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps): React.ReactElement => (
  <html lang="en">
    <body>
      <SaasErrorPage
        error={error}
        reset={reset}
        source="global-error-boundary"
        metadata={{ isGlobalError: true }}
      />
    </body>
  </html>
);

export default GlobalError;
