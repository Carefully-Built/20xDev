import { WorkOS } from '@workos-inc/node';

// Lazy initialization to avoid build-time errors
let _workos: WorkOS | null = null;

export function getWorkOS(): WorkOS {
  if (!_workos) {
    const apiKey = process.env.WORKOS_API_KEY;
    if (!apiKey) {
      throw new Error('WORKOS_API_KEY not set');
    }
    _workos = new WorkOS(apiKey);
  }
  return _workos;
}

// Proxy for backward compatibility - lazily initializes
export const workos = new Proxy({} as WorkOS, {
  get(_target, prop: keyof WorkOS) {
    return getWorkOS()[prop];
  },
});

// WorkOS configuration - lazy getters
export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID ?? '';
export const WORKOS_REDIRECT_URI =
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI
  ?? process.env.WORKOS_REDIRECT_URI
  ?? '';
export const WORKOS_COOKIE_PASSWORD = process.env.WORKOS_COOKIE_PASSWORD ?? '';
