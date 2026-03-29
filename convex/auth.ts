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

export const { authKitEvent } = authKit.events({
  'user.created': async (ctx, event) => {
    const now = Date.now();
    await ctx.db.insert('users', {
      workosId: event.data.id,
      email: event.data.email,
      name: getName(event.data.firstName, event.data.lastName),
      firstName: event.data.firstName ?? undefined,
      lastName: event.data.lastName ?? undefined,
      imageUrl: event.data.profilePictureUrl ?? undefined,
      role: 'member',
      createdAt: now,
      updatedAt: now,
    });
  },
  'user.updated': async (ctx, event) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', event.data.id))
      .unique();
    if (!user) {
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
