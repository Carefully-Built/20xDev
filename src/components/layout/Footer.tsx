'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GithubIcon, TwitterIcon } from '@/components/icons/social-icons';
import { Copyright } from '@/components/shared/copyright';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { landingNav, siteConfig } from '@/config/site';

const landingFooterBackground =
  'https://www.figma.com/api/mcp/asset/3ecc440c-5c0b-43cd-bc5c-59fe1ac6ae84';

const socialLinks = [
  { label: 'GitHub', href: siteConfig.social.github, icon: GithubIcon },
  { label: 'Twitter', href: siteConfig.social.twitter, icon: TwitterIcon },
];

const landingFooterColumns = [
  {
    title: 'Navigate',
    links: landingNav,
  },
  {
    title: 'Account',
    links: [
      { title: 'Sign In', href: '/login' },
      { title: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
      { title: 'GitHub', href: siteConfig.social.github },
      { title: 'X / Twitter', href: siteConfig.social.twitter },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms', href: '/terms' },
      { title: 'Support', href: '/contact' },
    ],
  },
] as const;

interface FooterProps {
  variant?: 'default' | 'landing';
  cta?: LandingFooterCta | null | 'auto';
}

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface LandingFooterCta {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

const defaultLandingFooterCta: LandingFooterCta = {
  title: 'Ship faster with the full starter',
  description:
    'Get the production-ready base for auth, organizations, billing, files, and dashboard flows without building the foundation from scratch.',
  buttonLabel: 'See pricing',
  buttonHref: '/pricing',
};

const contactLandingFooterCta: LandingFooterCta = {
  title: 'Get lifetime access',
  description: 'See the temporary 79€ deal and get access to the full starter.',
  buttonLabel: 'Get the 79€ deal',
  buttonHref: '/pricing',
};

export function Footer({ variant = 'default', cta = 'auto' }: FooterProps): React.ReactElement {
  if (variant === 'landing') {
    return <LandingFooter cta={cta} />;
  }

  return <DefaultFooter socialLinks={socialLinks} />;
}

function LandingFooter({
  cta = 'auto',
}: {
  cta?: LandingFooterCta | null | 'auto';
}): React.ReactElement {
  const pathname = usePathname();
  const resolvedCta = resolveLandingFooterCta(pathname, cta);

  return (
    <footer className="relative overflow-hidden bg-[#46838c] text-white">
      <div className="absolute inset-0">
        <img
          src={landingFooterBackground}
          alt=""
          className="absolute inset-x-0 top-0 h-[132%] w-full max-w-none object-cover object-top opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#46838c]/58 via-[#46838c]/18 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="h-px w-full rounded-full bg-white/30" />

        <div className="pt-[4.5rem] sm:pt-24">
          {resolvedCta ? <LandingFooterCtaCard cta={resolvedCta} /> : null}

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {landingFooterColumns.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="text-[1.24rem] leading-[1.9rem] font-normal tracking-[-0.02em] text-white">
                  {column.title}
                </h3>
                <ul className="mt-3 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.title}`}>
                      <FooterLink href={link.href} subtle={false}>
                        {link.title}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-24 flex flex-wrap items-center gap-x-2 gap-y-3 pb-10 text-[0.95rem] leading-6 text-white/60 sm:mt-36 sm:pb-12">
            <span className="rounded-full px-1.5 py-1">
              <Copyright className="text-white/60" />
            </span>
            {siteConfig.nav.footer.bottomLinks.map((link) => (
              <FooterLink
                key={link.title}
                href={link.href}
                subtle
                className="rounded-full px-3 py-1"
              >
                {link.title}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function LandingFooterCtaCard({ cta }: { cta: LandingFooterCta }): React.ReactElement {
  return (
    <section className="pb-[4.5rem] sm:pb-24">
      <div className="mx-auto grid max-w-[800px] gap-8 rounded-[24px] border border-[rgba(238,237,231,0.16)] bg-[rgba(106,154,162,0.28)] px-7 py-8 shadow-[0_16px_40px_rgba(31,66,72,0.12)] backdrop-blur-[8px] sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div className="max-w-[26rem]">
          <h2 className="text-[2.2rem] leading-[1.06] font-normal tracking-[-0.06em] text-[#f7f7f5] sm:text-[2.42rem]">
            {cta.title}
          </h2>
          <p className="mt-4 max-w-[24rem] text-[1rem] leading-7 tracking-[-0.02em] text-[#edece7] sm:text-[1.06rem]">
            {cta.description}
          </p>
        </div>

        <div className="flex items-start lg:justify-end">
          <Button
            asChild
            className="h-[3.25rem] rounded-full bg-white px-6 text-[1rem] font-medium tracking-[-0.02em] text-[#1a1816] shadow-none hover:bg-white/92 hover:text-[#1a1816] [a]:hover:bg-white/92 [a]:hover:text-[#1a1816]"
          >
            <Link href={cta.buttonHref}>{cta.buttonLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function DefaultFooter({ socialLinks }: { socialLinks: SocialLink[] }): React.ReactElement {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">{siteConfig.description}</p>
          </div>

          {siteConfig.nav.footer.columns.slice(0, 2).map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.title}`}>
                    <FooterLink
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {link.title}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <Copyright className="text-muted-foreground text-sm" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <link.icon className="size-5" />
                <span className="sr-only">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function resolveLandingFooterCta(
  pathname: string | null,
  cta: LandingFooterCta | null | 'auto',
): LandingFooterCta | null {
  if (cta !== 'auto') {
    return cta;
  }

  if (!pathname) {
    return defaultLandingFooterCta;
  }

  if (pathname === '/pricing') {
    return null;
  }

  if (pathname === '/contact') {
    return contactLandingFooterCta;
  }

  return defaultLandingFooterCta;
}

function FooterLink({
  href,
  children,
  subtle = true,
  className,
}: {
  href: string;
  children: React.ReactNode;
  subtle?: boolean;
  className?: string;
}): React.ReactElement {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');

  return (
    <Link
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={[
        'transition-colors',
        subtle ? 'text-white/60 hover:text-white' : 'text-white/92 hover:text-white',
        className ?? 'text-[0.96rem] leading-6 tracking-[-0.01em]',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}
