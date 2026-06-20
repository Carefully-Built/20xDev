/**
 * Convex Functions API
 *
 * Central namespace for all Convex database functions.
 *
 * Usage:
 *   import { users, items } from '@/convex/functions';
 *
 *   users.getById()
 *   users.create()
 *   items.listByOrganization()
 *   items.update()
 *
 * @module convex/functions
 */

export * as users from './users/index';
export * as activities from './activities/index';
export * as items from './items/index';
export * as files from './files/index';
export * as contacts from './contacts/index';
export * as organizations from './organizations/index';
export * as notes from './notes/index';
export * as notifications from './notifications/index';
