'use client';

import { AuthUpdatePasswordPage } from '@carefully-built/auth-pages/pages';

import { resetPassword } from '../actions';

export default function UpdatePasswordPage(): React.ReactElement {
  return (
    <AuthUpdatePasswordPage
      resetPassword={resetPassword}
      subtitle="Enter your new password"
      title="Update password"
    />
  );
}
