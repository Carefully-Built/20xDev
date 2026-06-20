import { describe, expect, test } from 'bun:test';

import {
  getSuperAdminAllowedEmails,
  isSuperAdminEmailAllowed,
  SUPER_ADMIN_EMAILS_ENV,
} from '../../src/lib/super-admin-access';

describe('super admin access', () => {
  test('uses SUPER_ADMIN_EMAILS as the shared allowlist env name', () => {
    expect(SUPER_ADMIN_EMAILS_ENV).toBe('SUPER_ADMIN_EMAILS');
  });

  test('normalizes comma-separated allowed emails', () => {
    expect(getSuperAdminAllowedEmails(' DodiAlessandro3@gmail.com, , admin@example.com ')).toEqual([
      'dodialessandro3@gmail.com',
      'admin@example.com',
    ]);
  });

  test('allows only emails present in the allowlist', () => {
    expect(
      isSuperAdminEmailAllowed('DodiAlessandro3@gmail.com', ' dodialessandro3@gmail.com ')
    ).toBe(true);
    expect(isSuperAdminEmailAllowed('someone@example.com', 'dodialessandro3@gmail.com')).toBe(
      false
    );
    expect(isSuperAdminEmailAllowed(undefined, 'dodialessandro3@gmail.com')).toBe(false);
  });
});
