import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('SaaS kit plumbing cleanup', () => {
  test('uses resource-kit error and destructive action helpers', () => {
    expect(existsSync(join(projectRoot, 'src/lib/error-handler.ts'))).toBe(false);
    expect(existsSync(join(projectRoot, 'src/lib/ui/destructive-action-toast.ts'))).toBe(false);
    expect(existsSync(join(projectRoot, 'src/lib/ui/destructive-action-toast-content.ts'))).toBe(
      false,
    );

    expect(readSource('src/app/test-error/page.tsx')).toContain('@carefully-built/saas-kit');
    expect(readSource('src/app/dashboard/contacts/_components/contacts-page-client.tsx')).toContain(
      '@carefully-built/saas-kit',
    );
    expect(
      readSource('src/app/dashboard/files/_components/documents/useDocumentsPage.ts'),
    ).toContain('@carefully-built/saas-kit');
  });

  test('uses WorkOS server token helpers for widget token routes', () => {
    expect(readSource('src/app/api/auth/token/route.ts')).toContain(
      '@carefully-built/saas-kit/server',
    );
    expect(readSource('src/app/api/widgets/token/route.ts')).toContain(
      '@carefully-built/saas-kit/server',
    );
  });

  test('removes safe dead local files reported by knip', () => {
    const removedFiles = [
      'src/app/dashboard/contacts/_data/contacts.ts',
      'src/components/layout/index.ts',
      'src/components/layout/page-layout.tsx',
      'src/components/layout/responsive-button.tsx',
      'src/components/providers/posthog-provider.tsx',
      'src/hooks/item-scope.ts',
      'src/hooks/use-item-mutations.ts',
      'src/hooks/use-items.ts',
      'src/hooks/use-organization-items.ts',
      'src/hooks/use-pagination.ts',
      'src/hooks/use-sync-user.ts',
      'src/lib/csv-export.ts',
      'src/lib/filters.ts',
      'src/lib/posthog.ts',
      'src/lib/workos-token.ts',
      'src/lib/workos-widgets.ts',
      'src/providers/query-provider.tsx',
    ];

    for (const file of removedFiles) {
      expect(existsSync(join(projectRoot, file))).toBe(false);
    }
  });
});
