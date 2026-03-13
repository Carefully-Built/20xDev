import { T } from 'gt-next';
import { FileText } from 'lucide-react';
import { redirect } from 'next/navigation';

import { BlogGrid } from './_components/blog-grid';
import { BlogHeader } from './_components/blog-header';
import { BlogPagination } from './_components/blog-pagination';
import { CategoryFilter } from './_components/category-filter';

import type { Category, PostListItem } from '@/types/blog';
import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { client } from '@/sanity/lib/client';
import {
  getCategoriesQuery,
  getPostCountQuery,
  getPostsQuery,
} from '@/sanity/lib/queries';

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Blog',
  description: `Insights, tutorials, and updates from the ${siteConfig.name} team.`,
  openGraph: { title: 'Blog', description: 'Insights, tutorials, and updates.' },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getBlogPageData(offset: number): Promise<{
  categories: Category[];
  posts: PostListItem[];
  totalCount: number;
}> {
  const [posts, totalCount, categories] = await Promise.all([
    client.fetch<PostListItem[]>(
      getPostsQuery,
      { offset, limit: offset + POSTS_PER_PAGE },
      { next: { tags: ['posts'] } },
    ),
    client.fetch<number>(getPostCountQuery, {}, { next: { tags: ['posts'] } }),
    client.fetch<Category[]>(getCategoriesQuery, {}, {
      next: { tags: ['categories'] },
    }),
  ]);

  return { categories, posts, totalCount };
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const { posts, totalCount, categories } = await getBlogPageData(offset);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const nextPageHref =
    currentPage < totalPages ? `/blog?page=${String(currentPage + 1)}` : undefined;

  if (totalCount > 0 && posts.length === 0 && currentPage > 1) {
    redirect(`/blog?page=${String(totalPages)}`);
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlogHeader
          title="News"
          actionHref={nextPageHref}
          actionLabel={nextPageHref ? 'See more' : undefined}
        />
        <CategoryFilter categories={categories} />
        {posts.length > 0 ? (
          <>
            <BlogGrid posts={posts} />
            <BlogPagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 size-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              <T id="blog.noPosts">No posts yet</T>
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              <T id="blog.noPostsDescription">
                Check back soon for new content.
              </T>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
