'use client';

import { AuthSignupPage } from '@carefully-built/auth-pages/pages';

import { signUp } from '../../actions';

export default function SignUpWithEmailPage(): React.ReactElement {
  return (
    <AuthSignupPage
      signUp={signUp}
      title="Sign up with email"
    />
  );
}
