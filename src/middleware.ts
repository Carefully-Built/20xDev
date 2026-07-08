import { createNextMiddleware } from 'gt-next/middleware';

/**
 * gt-next locale detection middleware.
 *
 * `localeRouting: false` is deliberate: it makes gt-next resolve the request
 * locale from `Accept-Language` (when no `generaltranslation.locale` cookie is
 * set) and pass it to the server render via the gt locale header — WITHOUT
 * adding any `/<locale>` URL prefix or redirecting. This keeps every existing
 * route/link unchanged while making page content default to the user's browser
 * language (so it matches the embedded WorkOS widget, which already localizes to
 * the browser). If a `generaltranslation.locale` cookie is already present, it
 * takes priority over `Accept-Language`.
 *
 * Resolution priority (gt-next): cookie → Accept-Language → defaultLocale (en).
 */
export default createNextMiddleware({ localeRouting: false });

export const config = {
  // Match all paths except API routes, Next.js internals, and static files.
  matcher: [String.raw`/((?!api|static|.*\..*|_next).*)`],
};
