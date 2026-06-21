import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('dashboard SaaS kit composition', () => {
  test('entity detail pages use the generic associated tab panel', () => {
    const contactDetail = readSource(
      'src/app/dashboard/contacts/[id]/_components/contact-detail.tsx',
    );
    const opportunityDetail = readSource(
      'src/app/dashboard/opportunities/[id]/_components/opportunity-detail.tsx',
    );

    expect(contactDetail).toContain('EntityAssociatedTabPanel');
    expect(opportunityDetail).toContain('EntityAssociatedTabPanel');
  });

  test('entity detail pages reuse resource-kit tab constants', () => {
    const contactDetail = readSource(
      'src/app/dashboard/contacts/[id]/_components/contact-detail.tsx',
    );
    const opportunityDetail = readSource(
      'src/app/dashboard/opportunities/[id]/_components/opportunity-detail.tsx',
    );

    expect(contactDetail).toContain('ENTITY_DETAIL_TABS');
    expect(opportunityDetail).toContain('ENTITY_DETAIL_TABS');
  });

  test('settings page uses the SaaS kit settings tabs', () => {
    const settingsPage = readSource('src/app/dashboard/settings/page.tsx');

    expect(settingsPage).toContain('SettingsTabs');
    expect(settingsPage).toContain('@carefully-built/saas-kit/settings/client');
  });

  test('opportunity edit sheet uses the CRUD resource sheet and form primitives', () => {
    const source = readSource(
      'src/app/dashboard/opportunities/[id]/_components/opportunity-edit-sheet.tsx',
    );

    expect(source).toContain('CrudResourceSheet');
    expect(source).toContain('CustomForm');
    expect(source).not.toContain('ResponsiveSheet');
  });
});
