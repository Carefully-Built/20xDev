import { EmptyStateCard } from '@carefully-built/ui';
import { T } from 'gt-next';
import { getGT } from 'gt-next/server';
import { LayoutDashboard } from 'lucide-react';

export default async function DashboardPage(): Promise<React.ReactElement> {
  // EmptyStateCard takes plain strings, so translate imperatively instead of <T>.
  const t = await getGT();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight"><T>Dashboard</T></h1>
      <EmptyStateCard
        icon={<LayoutDashboard className="size-6" />}
        title={t('Set up your dashboard')}
        subtitle={t(
          'This is where your product’s metrics and activity will live. Add your own widgets once the data model is in place.'
        )}
      />
    </div>
  );
}
