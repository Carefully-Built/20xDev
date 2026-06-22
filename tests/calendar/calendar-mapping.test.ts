import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { activityTypes } from '../../src/app/dashboard/calendar/_components/calendar/calendar.constants';
import { resolveActivityAssociations, toStoredActivityPayload } from '../../src/app/dashboard/calendar/_components/calendar/calendar.mapping';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

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

  test('keeps the calendar view switcher with toolbar controls and reserves the page action for adding events', () => {
    const source = readSource('src/app/dashboard/calendar/_components/calendar/CalendarPage.tsx');
    const layoutStart = source.indexOf('<DashboardPageLayout');
    const toolbarStart = source.indexOf('<TableToolbar');

    expect(source).toContain("label: 'Add event'");
    expect(source).toContain('<ResponsivePageActions');
    expect(layoutStart).toBeGreaterThan(-1);
    expect(toolbarStart).toBeGreaterThan(layoutStart);
    expect(source.slice(layoutStart, toolbarStart)).not.toContain('ActivityViewModeToggle');
    expect(source.slice(toolbarStart)).toContain('ActivityViewModeToggle');
    expect(source).toContain('sm:hidden');
  });
});
