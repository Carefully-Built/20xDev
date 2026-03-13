import { T } from 'gt-next';
import { FileText } from 'lucide-react';
import { notFound } from 'next/navigation';


import { BlogGrid } from '../../_components/blog-grid';
import { BlogHeader } from '../../_components/blog-header';
import { CategoryFilter } from '../../_components/category-filter';

import type { Category, PostListItem } from '@/types/blog';
import type { Metadata } from 'next';

import { client } from '@/sanity/lib/client';
import {
  getCategoriesQuery,
  getCategorySlugsQuery,
  getPostsByCategoryQuery,
} from '@/sanity/lib/queries';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await client.fetch<string[]>(getCategorySlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Failed to fetch category slugs:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await client.fetch<Category[]>(getCategoriesQuery, {}, {
    next: { tags: ['categories'] },
  });
  const category = categories.find((c) => c.slug.current === slug);

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.title} — Blog`,
    description: category.description ?? `Posts in ${category.title}`,
    openGraph: { title: `${category.title} — Blog` },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const [posts, categories] = await Promise.all([
    client.fetch<PostListItem[]>(
      getPostsByCategoryQuery,
      { categorySlug: slug },
      { next: { tags: [`category-${slug}`] } },
    ),
    client.fetch<Category[]>(getCategoriesQuery, {}, {
      next: { tags: ['categories'] },
    }),
  ]);

  const category = categories.find((c) => c.slug.current === slug);
  if (!category) notFound();

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlogHeader
          title={category.title}
          description={category.description}
          actionHref="/blog"
          actionLabel="See more"
        />
        <CategoryFilter categories={categories} />
        {posts.length > 0 ? (
          <BlogGrid posts={posts} />
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
