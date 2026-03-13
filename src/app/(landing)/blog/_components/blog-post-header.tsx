import Image from 'next/image';
import Link from 'next/link';

import type { Post } from '@/types/blog';
import { getBlogReadingTime } from '@/lib/blog';
import { getBlogImageAlt, getBlogImageSrc } from '@/lib/blog-image';

interface BlogPostHeaderProps {
  post: Post;
}

export function BlogPostHeader({
  post,
}: BlogPostHeaderProps): React.ReactElement {
  const readingTime = getBlogReadingTime(post.body);
  const primaryCategory = post.categories[0];

  return (
    <header className="mb-12 space-y-6 md:mb-14">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.84rem] uppercase tracking-[0.14em] text-[var(--landing-muted)]">
        {primaryCategory ? (
          <Link
            href={`/blog/category/${primaryCategory.slug.current}`}
            className="hover:text-[var(--landing-ink)]"
          >
            {primaryCategory.title}
          </Link>
        ) : (
          <span>Article</span>
        )}
        <span aria-hidden="true">/</span>
        <span>{readingTime} min read</span>
      </div>
      <div className="max-w-4xl">
        <h1 className="text-[2.8rem] leading-[0.96] tracking-[-0.07em] text-[var(--landing-ink)] md:text-[4.5rem]">
          {post.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 tracking-[-0.02em] text-[var(--landing-muted)]">
          {post.excerpt}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--landing-muted)]">
        <span className="font-medium text-[var(--landing-ink)]">{post.author.name}</span>
        <span aria-hidden="true">—</span>
        <time dateTime={post.publishedAt}>
          {new Intl.DateTimeFormat('en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }).format(new Date(post.publishedAt))}
        </time>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-[var(--landing-panel)]">
        <Image
          src={getBlogImageSrc(post.mainImage, 1200, 630)}
          alt={getBlogImageAlt(post.mainImage, post.title)}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute inset-0 rounded-[20px] border border-white/12" />
      </div>
    </header>
  );
}
