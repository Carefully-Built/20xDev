'use client';

import { AuthForgotPasswordPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { sendPasswordResetEmail } from '../actions';

export default function ForgotPasswordPage(): React.ReactElement {
  return (
    <AuthForgotPasswordPage
      sendPasswordResetEmail={sendPasswordResetEmail}
      subtitle="Inserisci la tua email per ricevere il link di reset della password"
      title="Password dimenticata"
    />
  );
}
