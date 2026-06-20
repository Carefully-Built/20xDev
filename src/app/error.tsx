'use client';

import { SaasErrorPage } from '@carefully-built/ui';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps): React.ReactElement => (
  <SaasErrorPage error={error} reset={reset} source="app-error-boundary" />
);

export default ErrorPage;
