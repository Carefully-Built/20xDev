import type { Post } from '@/types/blog';
import { urlForImage } from '@/sanity/lib/image';

interface JsonLdProps {
  readonly post: Post;
  readonly url: string;
}

export function JsonLd({ post, url }: JsonLdProps): React.ReactElement {
  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    url,
  };

  const safeJson = JSON.stringify(jsonLd).replaceAll('<', String.raw`\u003c`);

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson }} />;
}
