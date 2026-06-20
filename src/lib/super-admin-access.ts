export const SUPER_ADMIN_EMAILS_ENV = 'SUPER_ADMIN_EMAILS';

export function getSuperAdminAllowedEmails(
  emails = process.env[SUPER_ADMIN_EMAILS_ENV] ?? ''
): string[] {
  return emails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperAdminEmailAllowed(
  email: string | null | undefined,
  allowedEmails = process.env[SUPER_ADMIN_EMAILS_ENV] ?? ''
): boolean {
  if (!email) {
    return false;
  }

  return getSuperAdminAllowedEmails(allowedEmails).includes(email.trim().toLowerCase());
}
