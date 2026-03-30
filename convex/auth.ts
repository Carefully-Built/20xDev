import { AuthKit, type AuthFunctions } from '@convex-dev/workos-authkit';

import { components, internal } from './_generated/api';
import { deleteUserRecords, patchUserRecords, upsertUserRecord } from './lib/workos_user_sync';

import type { DataModel } from './_generated/dataModel';

const authFunctions: AuthFunctions = internal.auth;

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
  authFunctions,
});

export const { authKitEvent } = authKit.events({
  'user.created': async (ctx, event) => {
    await upsertUserRecord(ctx, {
      workosId: event.data.id,
      email: event.data.email,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      imageUrl: event.data.profilePictureUrl,
    });
  },
  'user.updated': async (ctx, event) => {
    await patchUserRecords(ctx, {
      workosId: event.data.id,
      email: event.data.email,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      imageUrl: event.data.profilePictureUrl,
    });
  },
  'user.deleted': async (ctx, event) => {
    await deleteUserRecords(ctx, event.data.id);
  },
});
