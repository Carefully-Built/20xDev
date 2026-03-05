import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { T } from 'gt-next';

import { client, isSanityConfigured } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { getPostBySlugQuery, getPostSlugsQuery } from '@/sanity/lib/queries';
import type { Post } from '@/types/blog';

import { BlogPostBody } from '../_components/blog-post-body';
import { BlogPostHeader } from '../_components/blog-post-header';
import { JsonLd } from '../_components/json-ld';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured) return [];
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
  if (!isSanityConfigured) return { title: 'Blog Post' };
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
  if (!isSanityConfigured) notFound();

  const post = await client.fetch<Post | null>(getPostBySlugQuery, { slug }, {
    next: { tags: [`post-${slug}`] },
  });

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
  const postUrl = siteUrl ? `${siteUrl}/blog/${slug}` : `/blog/${slug}`;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <JsonLd post={post} url={postUrl} />
        <BlogPostHeader post={post} />
        {post.body ? <BlogPostBody body={post.body} /> : null}
        <footer className="mt-12 border-t border-border pt-6">
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            <T id="blog.backToBlog">Back to Blog</T>
          </Link>
        </footer>
      </div>
    </section>
  );
}
