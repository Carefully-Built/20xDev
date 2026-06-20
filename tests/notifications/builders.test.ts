import { describe, expect, test } from 'bun:test';

import {
  buildContactCreatedNotification,
  buildFileUploadedNotification,
} from '../../convex/functions/notifications/builders';

describe('notification builders', () => {
  test('builds a real contact-created notification from contact data', () => {
    expect(
      buildContactCreatedNotification({
        contactId: 'contact_123',
        contactName: 'Ada Lovelace',
        createdAt: 1000,
        organizationId: 'org_123',
      }),
    ).toEqual({
      createdAt: 1000,
      entityId: 'contact_123',
      entityType: 'contact',
      href: '/dashboard/contacts',
      message: 'Ada Lovelace was added to the workspace.',
      organizationId: 'org_123',
      source: 'Contacts',
      title: 'New contact',
      type: 'people',
      typeLabel: 'Contacts',
    });
  });

  test('builds a real file-uploaded notification with association context', () => {
    expect(
      buildFileUploadedNotification({
        associationLabel: 'Ada Lovelace',
        createdAt: 2000,
        fileId: 'file_123',
        fileName: 'proposal.pdf',
        organizationId: 'org_123',
      }),
    ).toEqual({
      createdAt: 2000,
      entityId: 'file_123',
      entityType: 'file',
      href: '/dashboard/files',
      message: 'proposal.pdf was attached to Ada Lovelace.',
      organizationId: 'org_123',
      source: 'Files',
      title: 'Document attached',
      type: 'files',
      typeLabel: 'Files',
    });
  });
});
