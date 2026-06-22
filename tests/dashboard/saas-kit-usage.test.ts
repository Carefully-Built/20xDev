import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

function readKitSource(path: string): string {
  return readFileSync(join(projectRoot, '../carefully-built-saas-kit/packages', path), 'utf8');
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
    expect(settingsPage).toContain('@carefully-built/settings-ui/client');
  });

  test('opportunity edit sheet uses the CRUD resource sheet and form primitives', () => {
    const source = readSource(
      'src/app/dashboard/opportunities/[id]/_components/opportunity-edit-sheet.tsx',
    );

    expect(source).toContain('CrudResourceSheet');
    expect(source).toContain('CustomForm');
    expect(source).not.toContain('ResponsiveSheet');
  });

  test('contact empty tables render SaaS kit empty state cards', () => {
    const sources = [
      readSource('src/app/dashboard/contacts/_components/contacts-page-client.tsx'),
      readSource('src/app/dashboard/_components/overview-page.tsx'),
      readSource('src/app/dashboard/_components/dashboard-overview-stable.tsx'),
    ];

    for (const source of sources) {
      expect(source).toContain('EmptyStateCard');
      expect(source).toMatch(/(?:initialEmptyContent|noDataContent)=\{/);
      expect(source).toContain('title="No contacts yet"');
      expect(source).toContain('subtitle=');
    }
  });

  test('notifications empty state uses the same SaaS kit card primitive as notes', () => {
    const notificationList = readKitSource('notifications/src/notification-list.tsx');
    const notesGrid = readKitSource('notes/src/notes-grid.tsx');

    expect(notesGrid).toContain('EmptyStateCard');
    expect(notificationList).toContain('EmptyStateCard');
    expect(notificationList).not.toContain('flex min-h-52 flex-col');
  });

  test('Google Places address popup can be clicked inside contact sheet', () => {
    const contactSheet = readSource(
      'src/app/dashboard/contacts/_components/contact-form-sheet.tsx',
    );
    const globals = readSource('src/app/globals.css');
    const crudResourceSheet = readKitSource('crud/src/crud-resource-sheet.tsx');

    expect(contactSheet).toContain("outsideInteractionGuard={{ selectors: ['.pac-container'] }}");
    expect(crudResourceSheet).toContain('outsideInteractionGuard?: SheetOutsideInteractionGuard');
    expect(crudResourceSheet).toContain('outsideInteractionGuard={outsideInteractionGuard}');
    expect(globals).toContain('.pac-container');
    expect(globals).toContain('pointer-events: auto');
    expect(globals).toContain('.pac-item-selected');
  });
});
