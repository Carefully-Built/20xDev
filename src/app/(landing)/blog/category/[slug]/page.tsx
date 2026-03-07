import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FileText } from 'lucide-react';

import { client, isSanityConfigured } from '@/sanity/lib/client';
import {
  getCategoriesQuery,
  getCategorySlugsQuery,
  getPostsByCategoryQuery,
} from '@/sanity/lib/queries';
import type { Category, PostListItem } from '@/types/blog';

import { BlogGrid } from '../../_components/blog-grid';
import { BlogHeader } from '../../_components/blog-header';
import { CategoryFilter } from '../../_components/category-filter';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured) return [];
  const slugs = await client.fetch<string[]>(getCategorySlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  if (!isSanityConfigured) return { title: 'Category' };
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
  if (!isSanityConfigured) notFound();

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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlogHeader
          title={category.title}
          description={category.description}
        />
        <CategoryFilter categories={categories} />
        {posts.length > 0 ? (
          <BlogGrid posts={posts} />
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
