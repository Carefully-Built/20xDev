import Image from 'next/image';
import Link from 'next/link';

import { AuthButton } from './auth-button';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

import { landingNav, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  readonly variant?: 'default' | 'landing';
}

export function SiteHeader({ variant = 'default' }: SiteHeaderProps): React.ReactElement {
  return (
    <header
      className={cn(
        'top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300',
        variant === 'landing'
          ? 'landing-header fixed border-transparent bg-transparent shadow-none backdrop-blur-none'
          : 'sticky bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav items={landingNav} variant={variant} />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={variant === 'landing' ? 132 : 128}
              height={32}
              className={cn(
                'h-7 w-auto',
                variant === 'landing' && 'rounded-none bg-transparent p-0'
              )}
            />
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <MainNav items={landingNav} variant={variant} />
          <AuthButton variant={variant} />
        </div>

        <div className="flex items-center md:hidden">
          <AuthButton variant={variant} />
        </div>
      </div>
    </header>
  );
}
