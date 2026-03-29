import { AuthKit, type AuthFunctions } from '@convex-dev/workos-authkit';

import { components, internal } from './_generated/api';

import type { DataModel } from './_generated/dataModel';

const authFunctions: AuthFunctions = internal.auth;

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
  authFunctions,
});

function getName(firstName?: string | null, lastName?: string | null): string | undefined {
  return [firstName, lastName].filter(Boolean).join(' ') || undefined;
}

interface AuthKitUserData {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}

async function upsertAuthKitUser(
  ctx: Parameters<NonNullable<Parameters<typeof authKit.events>[0]['user.created']>>[0],
  user: AuthKitUserData
): Promise<void> {
  const existingUser = await ctx.db
    .query('users')
    .withIndex('by_workos_id', (q) => q.eq('workosId', user.id))
    .unique();
  const userData = {
    workosId: user.id,
    email: user.email,
    name: getName(user.firstName, user.lastName),
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.profilePictureUrl ?? undefined,
    updatedAt: Date.now(),
  };
  if (existingUser) {
    await ctx.db.patch(existingUser._id, userData);
    return;
  }
  await ctx.db.insert('users', {
    ...userData,
    role: 'member',
    createdAt: userData.updatedAt,
  });
}

export const { authKitEvent } = authKit.events({
  'user.created': async (ctx, event) => {
    await upsertAuthKitUser(ctx, event.data);
  },
  'user.updated': async (ctx, event) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', event.data.id))
      .unique();
    if (!user) {
      await upsertAuthKitUser(ctx, event.data);
      return;
    }
    await ctx.db.patch(user._id, {
      email: event.data.email,
      name: getName(event.data.firstName, event.data.lastName),
      firstName: event.data.firstName ?? undefined,
      lastName: event.data.lastName ?? undefined,
      imageUrl: event.data.profilePictureUrl ?? undefined,
      updatedAt: Date.now(),
    });
  },
  'user.deleted': async (ctx, event) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', event.data.id))
      .unique();
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});
