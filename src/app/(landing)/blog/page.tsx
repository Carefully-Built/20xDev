import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';

import { client, isSanityConfigured } from '@/sanity/lib/client';
import {
  getCategoriesQuery,
  getPostCountQuery,
  getPostsQuery,
} from '@/sanity/lib/queries';
import type { Category, PostListItem } from '@/types/blog';

import { BlogGrid } from './_components/blog-grid';
import { BlogHeader } from './_components/blog-header';
import { BlogPagination } from './_components/blog-pagination';
import { CategoryFilter } from './_components/category-filter';

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and updates from the 20x Step team.',
  openGraph: { title: 'Blog', description: 'Insights, tutorials, and updates.' },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  let posts: PostListItem[] = [];
  let totalCount = 0;
  let categories: Category[] = [];

  if (isSanityConfigured) {
    [posts, totalCount, categories] = await Promise.all([
      client.fetch<PostListItem[]>(getPostsQuery, {
        offset,
        limit: offset + POSTS_PER_PAGE,
      }, { next: { tags: ['posts'] } }),
      client.fetch<number>(getPostCountQuery, {}, { next: { tags: ['posts'] } }),
      client.fetch<Category[]>(getCategoriesQuery, {}, { next: { tags: ['categories'] } }),
    ]);
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (totalCount > 0 && posts.length === 0 && currentPage > 1) {
    redirect(`/blog?page=${totalPages}`);
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlogHeader />
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
              No posts yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              
                Check back soon for new content.
              
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
