/**
 * Reusable CSV Export Utility
 * 
 * Usage:
 *   exportToCsv(data, columns, 'items.csv');
 *   
 * Or with custom formatting:
 *   exportToCsv(data, columns, 'items.csv', {
 *     formatDate: (d) => new Date(d).toLocaleDateString(),
 *     excludeColumns: ['_id'],
 *   });
 */

export interface CsvColumn<T> {
  /** Header text for CSV */
  header: string;
  /** Key to access data (supports nested paths like 'user.name') */
  accessor: keyof T | string;
  /** Custom formatter for this column */
  format?: (value: unknown, row: T) => string;
}

export interface CsvExportOptions {
  /** Custom date formatter */
  formatDate?: (date: number | Date) => string;
  /** Columns to exclude from export */
  excludeColumns?: string[];
  /** Delimiter character (default: ',') */
  delimiter?: string;
  /** Include BOM for Excel compatibility (default: true) */
  includeBom?: boolean;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Escape CSV cell value
 */
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle objects/arrays to avoid [object Object]
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  
  // Escape if contains delimiter, quotes, or newlines
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Format a value for CSV export
 */
function formatCsvValue(
  value: unknown,
  options: CsvExportOptions,
): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle dates
  if (typeof value === 'number' && value > 1000000000000) {
    // Likely a timestamp in milliseconds
    if (options.formatDate) {
      return options.formatDate(value);
    }
    return new Date(value).toISOString();
  }

  if (value instanceof Date) {
    if (options.formatDate) {
      return options.formatDate(value);
    }
    return value.toISOString();
  }

  // Handle objects/arrays
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
}

/**
 * Export data to CSV and trigger download
 */
export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  columns: CsvColumn<T>[],
  filename: string,
  options: CsvExportOptions = {},
): void {
  const {
    excludeColumns = [],
    delimiter = ',',
    includeBom = true,
  } = options;

  // Filter out excluded columns
  const exportColumns = columns.filter(
    (col) => !excludeColumns.includes(String(col.accessor))
  );

  // Build header row
  const headers = exportColumns.map((col) => escapeCsvValue(col.header));
  
  // Build data rows
  const rows = data.map((item) =>
    exportColumns.map((col) => {
      const accessor = String(col.accessor);
      const value = accessor.includes('.')
        ? getNestedValue(item, accessor)
        : item[accessor as keyof T];

      if (col.format) {
        return escapeCsvValue(col.format(value, item));
      }

      return escapeCsvValue(formatCsvValue(value, options));
    })
  );

  // Combine into CSV string
  const csvContent = [
    headers.join(delimiter),
    ...rows.map((row) => row.join(delimiter)),
  ].join('\n');

  // Add BOM for Excel compatibility
  const bom = includeBom ? '\uFEFF' : '';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' });

  // Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert table columns to CSV columns
 * Helper to reuse existing table column definitions
 */
export function tableColumnsToCsv<T>(
  columns: { header: string; accessor?: keyof T | string }[],
): CsvColumn<T>[] {
  return columns
    .filter((col): col is typeof col & { accessor: string } => col.accessor !== undefined)
    .map((col) => ({
      header: col.header,
      accessor: col.accessor,
    }));
}
