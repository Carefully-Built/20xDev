import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features', id: 'features' },
    { label: 'Pricing', href: '/pricing', id: 'pricing' },
    { label: 'Documentation', href: '/docs', id: 'documentation' },
    { label: 'About', href: '/about', id: 'about' },
    { label: 'Contact', href: '/contact', id: 'contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy', id: 'privacyPolicy' },
    { label: 'Terms of Service', href: '/terms', id: 'termsOfService' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com', icon: Github },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  ],
};

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/blue_logo.svg"
                alt="Blueprint"
                width={32}
                height={32}
                className="size-8"
              />
              <span className="text-xl font-semibold">Blueprint</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Production-ready foundation for B2B SaaS. Ship faster with
              pre-built auth, payments, and real-time data.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Blueprint. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {footerLinks.social.map((link) => (
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
      </div>
    </footer>
  );
}
