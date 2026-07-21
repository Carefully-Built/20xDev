import { describe, expect, test } from 'bun:test';

import { requireOrgAdmin, requireSameOrg, requireUser } from '../convex/lib/auth';

import type { Doc, Id } from '../convex/_generated/dataModel';
import type { QueryCtx } from '../convex/_generated/server';

function makeUser(overrides: Partial<Doc<'users'>> = {}): Doc<'users'> {
  return {
    _id: 'users_1' as Id<'users'>,
    _creationTime: 0,
    workosId: 'user_1',
    email: 'admin@example.com',
    role: 'admin',
    organizationId: 'org_a',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function makeCtx(opts: { identity: { subject: string } | null; user?: Doc<'users'> | null }): QueryCtx {
  const first = (): Promise<Doc<'users'> | null> => Promise.resolve(opts.user ?? null);
  const ctx = {
    auth: { getUserIdentity: (): Promise<{ subject: string } | null> => Promise.resolve(opts.identity) },
    db: { query: () => ({ withIndex: () => ({ first }) }) },
  };
  return ctx as unknown as QueryCtx;
}

async function expectRejection(promise: Promise<unknown>, message: string): Promise<void> {
  let caught: unknown;
  try {
    await promise;
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(Error);
  expect((caught as Error).message).toBe(message);
}

describe('users CRUD auth guards', () => {
  test('requireUser rejects an unauthenticated caller', async () => {
    const ctx = makeCtx({ identity: null });
    await expectRejection(requireUser(ctx), 'Unauthorized: authentication required');
  });

  test('requireUser rejects an authenticated caller with no provisioned user', async () => {
    const ctx = makeCtx({ identity: { subject: 'user_ghost' }, user: null });
    await expectRejection(requireUser(ctx), 'Unauthorized: user not provisioned');
  });

  test('requireOrgAdmin rejects an authenticated non-admin', async () => {
    const ctx = makeCtx({ identity: { subject: 'user_1' }, user: makeUser({ role: 'member' }) });
    await expectRejection(requireOrgAdmin(ctx), 'Forbidden: admin role required');
  });

  test('requireOrgAdmin returns the caller for an admin', async () => {
    const ctx = makeCtx({ identity: { subject: 'user_1' }, user: makeUser({ role: 'admin' }) });
    const caller = await requireOrgAdmin(ctx);
    expect(caller.role).toBe('admin');
  });

  test('requireSameOrg rejects cross-organization access', () => {
    const caller = makeUser({ organizationId: 'org_a' });
    expect(() => { requireSameOrg(caller, 'org_b'); }).toThrow('Forbidden: cross-organization access denied');
  });

  test('requireSameOrg rejects a caller with no organization', () => {
    const caller = makeUser({ organizationId: undefined });
    expect(() => { requireSameOrg(caller, 'org_a'); }).toThrow('Forbidden: cross-organization access denied');
  });

  test('requireSameOrg allows same-organization access', () => {
    const caller = makeUser({ organizationId: 'org_a' });
    expect(() => { requireSameOrg(caller, 'org_a'); }).not.toThrow();
  });
});
