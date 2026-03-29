import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  signUpPaths: ['/signup', '/signup/email'],
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
  ],
};
