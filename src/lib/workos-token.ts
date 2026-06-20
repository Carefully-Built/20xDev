function decodeBase64Url(value: string): string | null {
  try {
    const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
    return globalThis.atob(base64);
  } catch {
    return null;
  }
}

export function getTokenOrganizationId(token: string | undefined): string | null {
  if (!token) {
    return null;
  }
  const payload = token.split('.')[1];
  if (!payload) {
    return null;
  }
  const decoded = decodeBase64Url(payload);
  if (!decoded) {
    return null;
  }
  try {
    const parsed = JSON.parse(decoded) as { org_id?: unknown };
    return typeof parsed.org_id === 'string' && parsed.org_id ? parsed.org_id : null;
  } catch {
    return null;
  }
}
