import Image from 'next/image';

import { T } from 'gt-next';

import type { Post } from '@/types/blog';
import { urlForImage } from '@/sanity/lib/image';

import { BlogCardMeta } from './blog-card-meta';
import { CategoryBadge } from './category-badge';

interface BlogPostHeaderProps {
  post: Post;
}

export function BlogPostHeader({
  post,
}: BlogPostHeaderProps): React.ReactElement {
  const readingTime = post.body
    ? Math.max(1, Math.ceil(JSON.stringify(post.body).length / 1500))
    : 1;

  return (
    <header className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-1">
        {post.categories.map((cat) => (
          <CategoryBadge
            key={cat._id}
            title={cat.title}
            slug={cat.slug.current}
          />
        ))}
      </div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {post.title}
      </h1>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <BlogCardMeta
          authorName={post.author.name}
          authorImage={post.author.image}
          publishedAt={post.publishedAt}
        />
        <span aria-hidden="true">·</span>
        <span>
          {readingTime}{' '}
          <T id="blog.minRead">min read</T>
        </span>
      </div>
      {post.mainImage ? (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={urlForImage(post.mainImage).width(1200).height(630).url()}
            alt={post.mainImage.alt ?? post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      ) : null}
    </header>
  );
}
