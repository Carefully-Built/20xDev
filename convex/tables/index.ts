// ============================================================
// TABLES INDEX
// Central export of all table definitions and validators
// ============================================================

// Users
export {
  createUserValidator,
  integrationPreferencesValidator,
  updateUserValidator,
  userRoleValidator,
  usersTable,
} from './users';

export {
  activitiesTable,
  activityAssociationValidator,
  activityMutationDataValidator,
  activityStatusValidator,
  activityVisibilityValidator,
} from './activities';

// Items
export {
  itemsTable,
  itemStatusValidator,
  itemPriorityValidator,
  createItemValidator,
  updateItemValidator,
} from './items';

// Contacts
export {
  contactsTable,
  contactStatusValidator,
  createContactValidator,
  updateContactValidator,
} from './contacts';

export { createNoteValidator, notesTable, updateNoteValidator } from './notes';

export {
  notificationEntityTypeValidator,
  notificationsTable,
  notificationTypeValidator,
} from './notifications';
