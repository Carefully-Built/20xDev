import { redirect } from 'next/navigation';

interface LegacySuperAdminPageProps {
  readonly params: Promise<{
    path?: string[];
  }>;
}

export default async function LegacySuperAdminPage({
  params,
}: LegacySuperAdminPageProps): Promise<never> {
  const { path } = await params;
  const suffix = path?.length ? `/${path.join('/')}` : '';

  redirect(`/super-admin${suffix}`);
}
