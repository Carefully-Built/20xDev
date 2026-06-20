import { defineSchema } from 'convex/server';

import { activitiesTable } from './tables/activities';
import { filesTable } from './tables/files';
import { contactsTable } from './tables/contacts';
import { itemsTable } from './tables/items';
import { notesTable } from './tables/notes';
import { notificationsTable } from './tables/notifications';
import { organizationsTable } from './tables/organizations';
import { usersTable } from './tables/users';

// ============================================================
// SCHEMA
// Combines all table definitions from ./tables/
// ============================================================

export default defineSchema({
  activities: activitiesTable,
  users: usersTable,
  items: itemsTable,
  files: filesTable,
  contacts: contactsTable,
  notes: notesTable,
  notifications: notificationsTable,
  organizations: organizationsTable,
});
