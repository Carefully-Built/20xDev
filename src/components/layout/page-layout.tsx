'use client';

import { T } from 'gt-next';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


interface PageLayoutProps {
  readonly title: ReactNode;
  readonly showBack?: boolean;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

export function PageLayout({
  title,
  showBack = false,
  actions,
  children,
}: PageLayoutProps): React.ReactElement {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => { router.back(); }}
                >
                  <ArrowLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><T>Back</T></TooltipContent>
            </Tooltip>
          )}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
