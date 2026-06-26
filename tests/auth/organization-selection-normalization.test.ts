import { describe, expect, test } from 'bun:test';

import { normalizeOrganizationSelectionOptions } from '@/lib/auth-organization-selection';

describe('normalizeOrganizationSelectionOptions', () => {
  test('preserves common organization logo URL fields', () => {
    expect(
      normalizeOrganizationSelectionOptions([
        {
          id: 'org_123',
          name: 'Carefully Built',
          logo_url: 'https://example.com/logo.png',
        },
        {
          organization: {
            id: 'org_456',
            name: 'Nested Org',
            imageUrl: 'https://example.com/nested.png',
          },
        },
      ]),
    ).toEqual([
      {
        id: 'org_123',
        logoUrl: 'https://example.com/logo.png',
        name: 'Carefully Built',
      },
      {
        id: 'org_456',
        logoUrl: 'https://example.com/nested.png',
        name: 'Nested Org',
      },
    ]);
  });
});
