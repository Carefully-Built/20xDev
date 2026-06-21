import { buildCsvExport, type ContactImportPreviewRow } from '@carefully-built/saas-kit/import-export';

import { contactStatusLabels } from './contacts-table';
import type { Contact, ContactData } from './contacts.types';

export function toContactData(row: ContactImportPreviewRow['normalized']): ContactData {
  if (!row) {
    throw new Error('Import row is empty');
  }

  return {
    company: row.company,
    name: row.name,
    status: row.status,
    ...(row.email ? { email: row.email } : {}),
    ...(row.notes ? { notes: row.notes } : {}),
    ...(row.owner ? { owner: row.owner } : {}),
    ...(row.phone ? { phone: row.phone } : {}),
    ...(row.role ? { role: row.role } : {}),
    ...(typeof row.value === 'number' ? { value: row.value } : {}),
  };
}

export function downloadCsv(filename: string, csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildContactsCsv(contacts: readonly Contact[]): string {
  return buildCsvExport(contacts, [
    { header: 'Name', value: (contact) => contact.name },
    { header: 'Company', value: (contact) => contact.company },
    { header: 'Email', value: (contact) => contact.email },
    { header: 'Phone', value: (contact) => contact.phone },
    { header: 'Owner', value: (contact) => contact.owner },
    { header: 'Status', value: (contact) => contactStatusLabels[contact.status] },
    { header: 'Value', value: (contact) => contact.value },
  ]);
}
