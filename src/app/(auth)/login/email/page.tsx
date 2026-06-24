'use client';

import { AuthEmailLoginPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { signIn } from '../../actions';

export default function LoginEmailPage(): React.ReactElement {
  return (
    <AuthEmailLoginPage
      signIn={signIn}
      title="Accedi con email"
      signupPromptText="Non hai un account?"
      signupLinkText="Registrati"
    />
  );
}
