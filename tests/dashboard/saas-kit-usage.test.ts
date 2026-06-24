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
  test('dashboard navigation excludes project-specific add-ons and grouped channels', () => {
    const navigation = readSource('src/app/dashboard/_components/dashboard-navigation.ts');
    const shell = readSource('src/app/dashboard/_components/dashboard-shell.tsx');

    expect(navigation).not.toContain('Editorial Boosting');
    expect(navigation).not.toContain('Directory Submission');
    expect(navigation).not.toContain('Guest Blog Posting');
    expect(navigation).not.toContain('RNO30 Lift');
    expect(navigation).not.toContain('Add-ons');
    expect(navigation).not.toContain('Channel');
    expect(navigation).not.toContain('navGroups');
    expect(shell).not.toContain('navGroups={navGroups}');
  });

  test('dashboard toolkit labels stay in English', () => {
    const source = readSource('src/lib/toolkit-labels.ts');

    expect(source).toContain("filtersButtonLabel: 'Filters'");
    expect(source).toContain("filtersTitle: 'Filters'");
    expect(source).toContain('buildAllOptionLabel');
    expect(source).toContain('All:');
    expect(source).not.toContain('Filtri');
    expect(source).not.toContain('Tutti');
    expect(source).not.toContain('Aggiungi');
    expect(source).not.toContain('Elimina');
  });

  test('dashboard kit buttons use the same radius family as search inputs', () => {
    const shell = readSource('src/app/dashboard/_components/dashboard-shell.tsx');
    const globals = readSource('src/app/globals.css');

    expect(shell).toContain('dataset.dashboard');
    expect(globals).toContain('html[data-dashboard=');
    expect(globals).toContain('[data-slot=\"button\"]');
    expect(globals).toContain('border-radius: var(--radius-lg) !important');
  });

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

  test('opportunity edit sheet uses the responsive sheet and form primitives', () => {
    const source = readSource(
      'src/app/dashboard/opportunities/[id]/_components/opportunity-edit-sheet.tsx',
    );

    expect(source).toContain('ResponsiveSheet');
    expect(source).toContain('CustomForm');
    expect(source).toContain('SchemaForm');
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

  test('Google Places address popup renders inside contact sheet', () => {
    const contactSheet = readSource(
      'src/app/dashboard/contacts/_components/contact-form-sheet.tsx',
    );
    const globals = readSource('src/app/globals.css');
    const crudResourceSheet = readKitSource('crud/src/crud-resource-sheet.tsx');

    expect(contactSheet).toContain('loadGoogleMapsPlacesApi');
    expect(contactSheet).toContain('ContactAddressPrediction');
    expect(contactSheet).toContain('getPlacePredictions');
    expect(contactSheet).toContain('getDetails');
    expect(crudResourceSheet).toContain('outsideInteractionGuard?: SheetOutsideInteractionGuard');
    expect(crudResourceSheet).toContain('outsideInteractionGuard={outsideInteractionGuard}');
    expect(globals).toContain('.pac-container');
    expect(globals).toContain('pointer-events: auto');
    expect(globals).toContain('.pac-item-selected');
  });

  test('Google Places address input keeps autocomplete stable while typing', () => {
    const contactSheet = readSource(
      'src/app/dashboard/contacts/_components/contact-form-sheet.tsx',
    );
    const globals = readSource('src/app/globals.css');

    expect(contactSheet).toContain('useCallback');
    expect(contactSheet).toContain('function ContactAddressField');
    expect(contactSheet).toContain('handleAddressChange');
    expect(contactSheet).toContain('handlePlaceSelect');
    expect(contactSheet).toContain('rounded-[16px]');
    expect(globals).toContain('box-shadow: none !important');
  });
});
