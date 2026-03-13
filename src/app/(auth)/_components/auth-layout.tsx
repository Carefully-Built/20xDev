import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { siteConfig } from '@/config/site';

interface AuthLayoutProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="absolute left-6 top-6">
        <Image src={siteConfig.logo} alt={siteConfig.name} height={32} width={128} className="h-8 w-auto" />
      </Link>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}
