import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { Copyright } from '@/components/shared/copyright';
import { ThemeToggle } from '@/components/theme-toggle';
import { GithubIcon, TwitterIcon } from '@/components/icons/social-icons';

const socialLinks = [
  { label: 'GitHub', href: siteConfig.social.github, icon: GithubIcon },
  { label: 'Twitter', href: siteConfig.social.twitter, icon: TwitterIcon },
];

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <FooterBrand />
          <FooterProductLinks />
          <FooterLegalLinks />
        </div>
        <FooterBottom socialLinks={socialLinks} />
      </div>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div className="md:col-span-2">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/blue_logo.svg" alt={siteConfig.name} width={32} height={32} className="size-8" />
        <span className="text-xl font-semibold">{siteConfig.name}</span>
      </Link>
      <p className="mt-4 max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
    </div>
  );
}

function FooterProductLinks() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">Product</h3>
      <ul className="space-y-3">
        {siteConfig.nav.footer.product.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLegalLinks() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">Legal</h3>
      <ul className="space-y-3">
        {siteConfig.nav.footer.legal.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function FooterBottom({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
      <Copyright className="text-sm text-muted-foreground" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {socialLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <link.icon className="size-5" />
            <span className="sr-only">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
