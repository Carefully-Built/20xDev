'use client';

import { AuthSignupPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { signUp } from '../../actions';

export default function SignUpWithEmailPage(): React.ReactElement {
  return (
    <AuthSignupPage
      signUp={signUp}
      title="Sign up with email"
      loginPromptText="Already have an account?"
      loginLinkText="Sign in"
    />
  );
}
