'use client';

import { AuthForgotPasswordPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { sendPasswordResetEmail } from '../actions';

export default function ForgotPasswordPage(): React.ReactElement {
  return (
    <AuthForgotPasswordPage
      sendPasswordResetEmail={sendPasswordResetEmail}
      subtitle="Enter your email to receive a password reset link"
      title="Forgot password"
    />
  );
}
