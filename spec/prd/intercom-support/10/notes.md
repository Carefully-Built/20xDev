# Notes -- Issue #10

### Assumptions Made

- **Landing-scoped, not global**: The issue says "Configure Intercom to show on public pages (landing, pricing, docs)". All these are under the `(landing)` route group, so the provider goes in `src/app/(landing)/layout.tsx` rather than the root layout. This keeps the widget off dashboard pages as stated in "Out of Scope".

- **No npm package needed**: Intercom provides a CDN script (`widget.intercom.io/widget/{APP_ID}`). No `@intercom/messenger-js-sdk` or similar npm package is needed, which avoids adding bundle weight. The issue's suggestion to "add Intercom SDK if using npm package" in `package.json` is addressed by choosing the CDN approach instead.

- **No user data in v1 landing**: On landing pages, users are typically not authenticated (auth pages are separate). The `bootIntercom()` call uses no user data by default. If authenticated user data becomes available on landing pages in the future, `updateIntercom({ name, email })` can be called.

- **Dark theme**: Intercom widget appearance (colors, launcher style) is configured in the Intercom dashboard, not via code. The `background_color` and `action_color` settings in `bootIntercom` can override dashboard settings if needed, but are left as defaults for v1 to allow dashboard control.

- **No Identity Verification (HMAC)**: Intercom recommends server-side HMAC for production to prevent impersonation. This requires a server-side secret and is out of scope for v1 but should be added before production use with authenticated users.
