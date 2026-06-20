export type NotificationEntityType = 'contact' | 'file';
export type NotificationType = 'files' | 'people';

export interface NotificationRecordInput {
  readonly createdAt: number;
  readonly entityId: string;
  readonly entityType: NotificationEntityType;
  readonly href: string;
  readonly message: string;
  readonly organizationId: string;
  readonly source: string;
  readonly title: string;
  readonly type: NotificationType;
  readonly typeLabel: string;
}

interface ContactCreatedNotificationArgs {
  readonly contactId: string;
  readonly contactName: string;
  readonly createdAt: number;
  readonly organizationId: string;
}

interface FileUploadedNotificationArgs {
  readonly associationLabel?: string;
  readonly createdAt: number;
  readonly fileId: string;
  readonly fileName: string;
  readonly organizationId: string;
}

export function buildContactCreatedNotification({
  contactId,
  contactName,
  createdAt,
  organizationId,
}: ContactCreatedNotificationArgs): NotificationRecordInput {
  return {
    createdAt,
    entityId: contactId,
    entityType: 'contact',
    href: '/dashboard/contacts',
    message: `${contactName} was added to the workspace.`,
    organizationId,
    source: 'Contacts',
    title: 'New contact',
    type: 'people',
    typeLabel: 'Contacts',
  };
}

export function buildFileUploadedNotification({
  associationLabel,
  createdAt,
  fileId,
  fileName,
  organizationId,
}: FileUploadedNotificationArgs): NotificationRecordInput {
  const message = associationLabel
    ? `${fileName} was attached to ${associationLabel}.`
    : `${fileName} was uploaded.`;

  return {
    createdAt,
    entityId: fileId,
    entityType: 'file',
    href: '/dashboard/files',
    message,
    organizationId,
    source: 'Files',
    title: 'Document attached',
    type: 'files',
    typeLabel: 'Files',
  };
}
