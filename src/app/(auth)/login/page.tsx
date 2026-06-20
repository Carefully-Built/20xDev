'use client';

import { AuthLoginPage } from '@carefully-built/auth-pages/pages';

import { getGoogleAuthUrl } from '../actions';

const providers = [
  {
    name: 'Google',
    icon: '/images/icons/google.svg',
    action: getGoogleAuthUrl,
  },
];

export default function LoginPage(): React.ReactElement {
  return (
    <AuthLoginPage
      title="Log in"
      providers={providers}
      emailLabel="Continue with email"
    />
  );
}
