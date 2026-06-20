import { describe, expect, test } from 'bun:test';

import { activityTypes } from '../../src/app/dashboard/calendar/_components/calendar/calendar.constants';
import { resolveActivityAssociations, toStoredActivityPayload } from '../../src/app/dashboard/calendar/_components/calendar/calendar.mapping';

describe('calendar mapping', () => {
  test('maps agenda payloads into stored activity data', () => {
    expect(
      toStoredActivityPayload(
        {
          title: 'Kickoff',
          activityTypeId: 'call',
          assignedUserId: 'user_123',
          participantUserIds: ['user_123', 'user_456'],
          visibility: 'public',
          associations: [{ entityId: 'contact_123', entityType: 'contact' }],
          tagIds: ['important'],
          startAt: 1_700_000_000_000,
          endAt: 1_700_003_600_000,
          description: 'Discuss launch plan',
          status: 'scheduled',
        },
        [
          {
            entityId: 'contact_123',
            entityType: 'contact',
            label: 'Ada Lovelace',
            typeLabel: 'Contact',
            value: 'contact:contact_123',
          },
        ],
        activityTypes,
      ),
    ).toEqual({
      title: 'Kickoff',
      activityTypeId: 'call',
      activityTypeLabel: 'Call',
      activityTypeColor: '#06B6D4',
      assignedUserId: 'user_123',
      participantUserIds: ['user_123', 'user_456'],
      visibility: 'public',
      associations: [
        {
          entityId: 'contact_123',
          entityType: 'contact',
          label: 'Ada Lovelace',
          typeLabel: 'Contact',
          value: 'contact:contact_123',
        },
      ],
      tagIds: ['important'],
      startAt: 1_700_000_000_000,
      endAt: 1_700_003_600_000,
      description: 'Discuss launch plan',
      status: 'scheduled',
    });
  });

  test('drops unsupported or unresolved associations', () => {
    expect(
      resolveActivityAssociations(
        [
          { entityId: 'contact_123', entityType: 'contact' },
          { entityId: 'activity_123', entityType: 'activity' },
          { entityId: 'missing_123', entityType: 'contact' },
        ],
        [
          {
            entityId: 'contact_123',
            entityType: 'contact',
            label: 'Ada Lovelace',
            typeLabel: 'Contact',
            value: 'contact:contact_123',
          },
          {
            entityId: 'activity_123',
            entityType: 'activity',
            label: 'Follow up',
            typeLabel: 'Activity',
            value: 'activity:activity_123',
          },
        ],
      ),
    ).toEqual([
      {
        entityId: 'contact_123',
        entityType: 'contact',
        label: 'Ada Lovelace',
        typeLabel: 'Contact',
        value: 'contact:contact_123',
      },
    ]);
  });
});
