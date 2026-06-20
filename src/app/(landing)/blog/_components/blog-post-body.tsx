import { PortableText } from '@portabletext/react';
import type { PortableTextBlock, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';

import { urlForImage } from '@/sanity/lib/image';

import { CodeBlock } from './code-block';

const ALLOWED_HREF_PROTOCOLS = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

function sanitizeHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (ALLOWED_HREF_PROTOCOLS.test(trimmed)) return trimmed;
  return undefined;
}

const components: PortableTextComponents = {
  types: {
    image: ({
      value,
    }: {
      readonly value: {
        readonly asset: { readonly _ref: string };
        readonly alt?: string;
        readonly caption?: string;
      };
    }) => {
      const imageUrl = urlForImage(value).width(800).url();
      return (
        <figure className="my-6">
          <Image
            src={imageUrl}
            alt={value.alt ?? ''}
            width={800}
            height={450}
            className="rounded-lg"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {value.caption ? (
            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    code: ({
      value,
    }: {
      readonly value: { readonly language?: string; readonly code: string };
    }) => <CodeBlock language={value.language} code={value.code} />,
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      readonly children: React.ReactNode;
      readonly value?: { readonly href: string };
    }) => {
      const safeHref = sanitizeHref(value?.href);
      if (!safeHref) return <>{children}</>;
      return (
        <a
          href={safeHref}
          className="text-primary hover:text-primary/80 underline underline-offset-4"
          target={safeHref.startsWith('http') ? '_blank' : undefined}
          rel={safeHref.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
    code: ({ children }: { readonly children: React.ReactNode }) => (
      <code className="bg-muted rounded px-1.5 py-0.5 text-sm">{children}</code>
    ),
  },
};

interface BlogPostBodyProps {
  readonly body: PortableTextBlock[];
}

export function BlogPostBody({ body }: BlogPostBodyProps): React.ReactElement {
  return (
    <div className="prose prose-sm prose-headings:text-[var(--landing-ink)] prose-p:text-[color:color-mix(in_oklab,var(--landing-ink)_76%,white)] prose-p:leading-8 prose-a:text-[var(--landing-ink)] prose-strong:text-[var(--landing-ink)] prose-code:text-[var(--landing-ink)] md:prose-base max-w-none text-[var(--landing-ink)]">
      <PortableText value={body} components={components} />
    </div>
  );
}
