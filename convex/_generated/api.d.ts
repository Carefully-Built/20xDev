/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as functions_activities_helpers from "../functions/activities/helpers.js";
import type * as functions_activities_index from "../functions/activities/index.js";
import type * as functions_activities_mutations from "../functions/activities/mutations.js";
import type * as functions_activities_queries from "../functions/activities/queries.js";
import type * as functions_contacts_auth from "../functions/contacts/auth.js";
import type * as functions_contacts_helpers from "../functions/contacts/helpers.js";
import type * as functions_contacts_index from "../functions/contacts/index.js";
import type * as functions_contacts_mutations from "../functions/contacts/mutations.js";
import type * as functions_contacts_queries from "../functions/contacts/queries.js";
import type * as functions_files_index from "../functions/files/index.js";
import type * as functions_files_mutations from "../functions/files/mutations.js";
import type * as functions_files_queries from "../functions/files/queries.js";
import type * as functions_index from "../functions/index.js";
import type * as functions_items_auth from "../functions/items/auth.js";
import type * as functions_items_helpers from "../functions/items/helpers.js";
import type * as functions_items_index from "../functions/items/index.js";
import type * as functions_items_mutation_auth from "../functions/items/mutation_auth.js";
import type * as functions_items_mutations from "../functions/items/mutations.js";
import type * as functions_items_queries from "../functions/items/queries.js";
import type * as functions_notes_helpers from "../functions/notes/helpers.js";
import type * as functions_notes_index from "../functions/notes/index.js";
import type * as functions_notes_mutations from "../functions/notes/mutations.js";
import type * as functions_notes_queries from "../functions/notes/queries.js";
import type * as functions_notifications_builders from "../functions/notifications/builders.js";
import type * as functions_notifications_helpers from "../functions/notifications/helpers.js";
import type * as functions_notifications_index from "../functions/notifications/index.js";
import type * as functions_notifications_mutations from "../functions/notifications/mutations.js";
import type * as functions_notifications_queries from "../functions/notifications/queries.js";
import type * as functions_organizations_index from "../functions/organizations/index.js";
import type * as functions_organizations_mutations from "../functions/organizations/mutations.js";
import type * as functions_organizations_queries from "../functions/organizations/queries.js";
import type * as functions_users_index from "../functions/users/index.js";
import type * as functions_users_mutations from "../functions/users/mutations.js";
import type * as functions_users_queries from "../functions/users/queries.js";
import type * as http from "../http.js";
import type * as lib_organization_user from "../lib/organization_user.js";
import type * as lib_workos_user_sync from "../lib/workos_user_sync.js";
import type * as tables_activities from "../tables/activities.js";
import type * as tables_contacts from "../tables/contacts.js";
import type * as tables_files from "../tables/files.js";
import type * as tables_index from "../tables/index.js";
import type * as tables_items from "../tables/items.js";
import type * as tables_notes from "../tables/notes.js";
import type * as tables_notifications from "../tables/notifications.js";
import type * as tables_organizations from "../tables/organizations.js";
import type * as tables_users from "../tables/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "functions/activities/helpers": typeof functions_activities_helpers;
  "functions/activities/index": typeof functions_activities_index;
  "functions/activities/mutations": typeof functions_activities_mutations;
  "functions/activities/queries": typeof functions_activities_queries;
  "functions/contacts/auth": typeof functions_contacts_auth;
  "functions/contacts/helpers": typeof functions_contacts_helpers;
  "functions/contacts/index": typeof functions_contacts_index;
  "functions/contacts/mutations": typeof functions_contacts_mutations;
  "functions/contacts/queries": typeof functions_contacts_queries;
  "functions/files/index": typeof functions_files_index;
  "functions/files/mutations": typeof functions_files_mutations;
  "functions/files/queries": typeof functions_files_queries;
  "functions/index": typeof functions_index;
  "functions/items/auth": typeof functions_items_auth;
  "functions/items/helpers": typeof functions_items_helpers;
  "functions/items/index": typeof functions_items_index;
  "functions/items/mutation_auth": typeof functions_items_mutation_auth;
  "functions/items/mutations": typeof functions_items_mutations;
  "functions/items/queries": typeof functions_items_queries;
  "functions/notes/helpers": typeof functions_notes_helpers;
  "functions/notes/index": typeof functions_notes_index;
  "functions/notes/mutations": typeof functions_notes_mutations;
  "functions/notes/queries": typeof functions_notes_queries;
  "functions/notifications/builders": typeof functions_notifications_builders;
  "functions/notifications/helpers": typeof functions_notifications_helpers;
  "functions/notifications/index": typeof functions_notifications_index;
  "functions/notifications/mutations": typeof functions_notifications_mutations;
  "functions/notifications/queries": typeof functions_notifications_queries;
  "functions/organizations/index": typeof functions_organizations_index;
  "functions/organizations/mutations": typeof functions_organizations_mutations;
  "functions/organizations/queries": typeof functions_organizations_queries;
  "functions/users/index": typeof functions_users_index;
  "functions/users/mutations": typeof functions_users_mutations;
  "functions/users/queries": typeof functions_users_queries;
  http: typeof http;
  "lib/organization_user": typeof lib_organization_user;
  "lib/workos_user_sync": typeof lib_workos_user_sync;
  "tables/activities": typeof tables_activities;
  "tables/contacts": typeof tables_contacts;
  "tables/files": typeof tables_files;
  "tables/index": typeof tables_index;
  "tables/items": typeof tables_items;
  "tables/notes": typeof tables_notes;
  "tables/notifications": typeof tables_notifications;
  "tables/organizations": typeof tables_organizations;
  "tables/users": typeof tables_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workOSAuthKit: import("@convex-dev/workos-authkit/_generated/component.js").ComponentApi<"workOSAuthKit">;
};
