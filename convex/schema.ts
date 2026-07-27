import { defineSchema } from 'convex/server';

import { filesTable } from './tables/files';
import { organizationsTable } from './tables/organizations';
import { usersTable } from './tables/users';

// ============================================================
// SCHEMA
// Combines all table definitions from ./tables/
// ============================================================

export default defineSchema({
  users: usersTable,
  files: filesTable,
  organizations: organizationsTable,
});
