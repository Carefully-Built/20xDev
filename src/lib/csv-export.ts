/**
 * Reusable CSV Export Utility
 */

export interface CsvColumn<T> {
  header: string;
  accessor: keyof T | string;
  format?: (value: unknown, row: T) => string;
}

export interface CsvExportOptions {
  formatDate?: (date: number | Date) => string;
  excludeColumns?: string[];
  delimiter?: string;
  includeBom?: boolean;
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function toCsvString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return JSON.stringify(value);
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = toCsvString(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function formatCsvValue(value: unknown, options: CsvExportOptions): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number' && value > 1000000000000) {
    return options.formatDate ? options.formatDate(value) : new Date(value).toISOString();
  }
  if (value instanceof Date) {
    return options.formatDate ? options.formatDate(value) : value.toISOString();
  }
  return toCsvString(value);
}

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  columns: CsvColumn<T>[],
  filename: string,
  options: CsvExportOptions = {}
): void {
  const { excludeColumns = [], delimiter = ',', includeBom = true } = options;
  const exportColumns = columns.filter((col) => !excludeColumns.includes(String(col.accessor)));
  const headers = exportColumns.map((col) => escapeCsvValue(col.header));
  const rows = data.map((item) => exportColumns.map((col) => {
    const accessor = String(col.accessor);
    const value = accessor.includes('.') ? getNestedValue(item, accessor) : item[accessor as keyof T];
    const formatted = col.format ? col.format(value, item) : formatCsvValue(value, options);
    return escapeCsvValue(formatted);
  }));
  const csvContent = [headers.join(delimiter), ...rows.map((row) => row.join(delimiter))].join('\n');
  const blob = new Blob([`${includeBom ? '\uFEFF' : ''}${csvContent}`], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function tableColumnsToCsv<T>(
  columns: { header: string; accessor?: keyof T | string }[]
): CsvColumn<T>[] {
  return columns.flatMap((col) => (col.accessor === undefined ? [] : [{
    header: col.header,
    accessor: col.accessor,
  }]));
}
