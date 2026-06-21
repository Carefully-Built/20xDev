import type { api } from '@convex/_generated/api';
import type { Doc } from '@convex/_generated/dataModel';
import type { FunctionArgs } from 'convex/server';

export type Contact = Doc<'contacts'>;
export type ContactData = FunctionArgs<typeof api.functions.contacts.mutations.create>['data'];
