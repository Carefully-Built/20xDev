import type { PostListItem } from '@/types/blog';

import { BlogCard } from './blog-card';

interface BlogGridProps {
  posts: PostListItem[];
}

export function BlogGrid({ posts }: BlogGridProps): React.ReactElement {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
