'use client';

import { AuthLoginPage } from '@carefully-built/saas-kit/auth-pages/pages';

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
      title="Accedi"
      providers={providers}
      emailLabel="Continua con email"
    />
  );
}
