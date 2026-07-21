import { T } from 'gt-next';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight"><T>Dashboard</T></h1>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <LayoutDashboard className="size-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold"><T>Your dashboard is empty</T></h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          <T>Metrics and activity will appear here once you start adding data.</T>
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/items"><T>Create your first item</T></Link>
        </Button>
      </div>
    </div>
  );
}
