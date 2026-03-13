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
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string } }) => {
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
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    code: ({ value }: { value: { language?: string; code: string } }) => (
      <CodeBlock language={value.language} code={value.code} />
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string } }) => {
      const safeHref = sanitizeHref(value?.href);
      if (!safeHref) return <>{children}</>;
      return (
        <a
          href={safeHref}
          className="text-primary underline underline-offset-4 hover:text-primary/80"
          target={safeHref.startsWith('http') ? '_blank' : undefined}
          rel={safeHref.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>
    ),
  },
};

interface BlogPostBodyProps {
  body: PortableTextBlock[];
}

export function BlogPostBody({ body }: BlogPostBodyProps): React.ReactElement {
  return (
    <div className="prose prose-sm max-w-none text-[var(--landing-ink)] prose-headings:text-[var(--landing-ink)] prose-p:text-[color:color-mix(in_oklab,var(--landing-ink)_76%,white)] prose-p:leading-8 prose-a:text-[var(--landing-ink)] prose-strong:text-[var(--landing-ink)] prose-code:text-[var(--landing-ink)] md:prose-base">
      <PortableText value={body} components={components} />
    </div>
  );
}
