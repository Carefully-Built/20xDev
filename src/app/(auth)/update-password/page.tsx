'use client';

import { AuthUpdatePasswordPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { resetPassword } from '../actions';

export default function UpdatePasswordPage(): React.ReactElement {
  return (
    <AuthUpdatePasswordPage
      resetPassword={resetPassword}
      subtitle="Inserisci la nuova password"
      title="Aggiorna password"
    />
  );
}
