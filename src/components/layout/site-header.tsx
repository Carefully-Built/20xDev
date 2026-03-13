import Image from 'next/image';
import Link from 'next/link';

import { AuthButton } from './auth-button';
import { LocaleSwitcher } from './locale-switcher';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

import { landingNav } from '@/config/site';

export function SiteHeader(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav items={landingNav} />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/images/blue_logo.svg"
              alt="20x Step"
              width={32}
              height={32}
              className="size-8"
            />
            <span className="text-xl">20x Step</span>
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <MainNav items={landingNav} />
          <LocaleSwitcher />
          <AuthButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
