import Link from 'next/link';
import { T } from 'gt-next';

import { Card } from '@/components/ui/card';
import type { PostListItem } from '@/types/blog';

import { BlogCardImage } from './blog-card-image';
import { BlogCardMeta } from './blog-card-meta';
import { CategoryBadge } from './category-badge';

interface BlogCardProps {
  post: PostListItem;
}

export function BlogCard({ post }: BlogCardProps): React.ReactElement {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {post.mainImage ? (
        <BlogCardImage image={post.mainImage} title={post.title} />
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1">
          {post.categories.map((cat) => (
            <CategoryBadge
              key={cat.slug.current}
              title={cat.title}
              slug={cat.slug.current}
            />
          ))}
        </div>
        <Link href={`/blog/${post.slug.current}`} className="group/link">
          <h2 className="text-lg font-semibold leading-snug group-hover/link:underline">
            {post.title}
          </h2>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-2">
          <BlogCardMeta
            authorName={post.author.name}
            authorImage={post.author.image}
            publishedAt={post.publishedAt}
          />
        </div>
        <Link
          href={`/blog/${post.slug.current}`}
          className="min-h-[44px] text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          <T id="blog.readMore">Read more</T>
        </Link>
      </div>
    </Card>
  );
}
