'use client';

import { AuthEmailLoginPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { signIn } from '../../actions';

export default function LoginEmailPage(): React.ReactElement {
  return (
    <AuthEmailLoginPage
      signIn={signIn}
      title="Sign in with email"
      signupPromptText="Don't have an account?"
      signupLinkText="Sign up"
    />
  );
}
