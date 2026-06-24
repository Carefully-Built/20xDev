'use client';

import { AuthSignupPage } from '@carefully-built/saas-kit/auth-pages/pages';

import { signUp } from '../../actions';

export default function SignUpWithEmailPage(): React.ReactElement {
  return (
    <AuthSignupPage
      signUp={signUp}
      title="Registrati con email"
      loginPromptText="Hai gia un account?"
      loginLinkText="Accedi"
    />
  );
}
