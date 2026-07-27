/**
 * Convex Functions API
 *
 * Central namespace for all Convex database functions.
 *
 * Usage:
 *   import { users, files } from '@/convex/functions';
 *
 *   users.getById()
 *   users.create()
 *   files.listByOrganization()
 *   files.remove()
 *
 * @module convex/functions
 */

export * as users from './users/index';
export * as files from './files/index';
export * as organizations from './organizations/index';
