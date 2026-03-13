import Link from 'next/link';

import type { PostListItem } from '@/types/blog';
import { getExcerptReadingTime } from '@/lib/blog';

import { BlogCardImage } from './blog-card-image';

interface BlogCardProps {
  post: PostListItem;
}

export function BlogCard({ post }: BlogCardProps): React.ReactElement {
  const primaryCategory = post.categories[0]?.title ?? 'Article';
  const readingTime = getExcerptReadingTime(post.excerpt);

  return (
    <article className="group">
      <Link
        href={`/blog/${post.slug.current}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-surface)] rounded-[12px]"
      >
        <BlogCardImage image={post.mainImage} title={post.title} />
      </Link>
      <div className="px-1 pt-4">
        <Link
          href={`/blog/${post.slug.current}`}
          className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <h2 className="max-w-[20ch] text-[1.95rem] leading-[1.05] tracking-[-0.055em] text-[var(--landing-ink)] sm:text-[2rem] lg:text-[2.05rem]">
            {post.title}
          </h2>
        </Link>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.78rem] tracking-[-0.01em] text-[color:color-mix(in_oklab,var(--landing-muted)_92%,white)]">
          <span>{primaryCategory}</span>
          <span aria-hidden="true">—</span>
          <span>{readingTime} min read</span>
        </p>
      </div>
    </article>
  );
}
