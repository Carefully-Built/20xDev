import type { PostListItem } from '@/types/blog';

import { BlogCard } from './blog-card';

interface BlogGridProps {
  posts: PostListItem[];
}

export function BlogGrid({ posts }: BlogGridProps): React.ReactElement {
  return (
    <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
