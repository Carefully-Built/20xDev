import { T } from 'gt-next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlogPostBody } from '../_components/blog-post-body';
import { BlogPostHeader } from '../_components/blog-post-header';
import { JsonLd } from '../_components/json-ld';

import type { Post } from '@/types/blog';
import type { Metadata } from 'next';

import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { getPostBySlugQuery, getPostSlugsQuery } from '@/sanity/lib/queries';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await client.fetch<string[]>(getPostSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Failed to fetch post slugs:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(getPostBySlugQuery, { slug }, {
    next: { tags: [`post-${slug}`] },
  });

  if (!post) return { title: 'Post Not Found' };

  const ogImage = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function PostPage({
  params,
}: PostPageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const post = await client.fetch<Post | null>(getPostBySlugQuery, { slug }, {
    next: { tags: [`post-${slug}`] },
  });

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
  const postUrl = siteUrl ? `${siteUrl}/blog/${slug}` : `/blog/${slug}`;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <JsonLd post={post} url={postUrl} />
        <BlogPostHeader post={post} />
        <div className="mx-auto max-w-3xl">
          {post.body ? <BlogPostBody body={post.body} /> : null}
        </div>
        <footer className="mx-auto mt-14 max-w-3xl border-t border-[color:color-mix(in_oklab,var(--landing-ink)_10%,white)] pt-6">
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--landing-ink)] hover:underline"
          >
            <ArrowLeft className="size-4" />
            <T id="blog.backToBlog">Back to Blog</T>
          </Link>
        </footer>
      </div>
    </section>
  );
}
