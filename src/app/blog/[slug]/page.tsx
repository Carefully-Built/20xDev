import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { client, isSanityConfigured } from '@/sanity/lib/client';
import { getPostBySlugQuery, getPostSlugsQuery } from '@/sanity/lib/queries';
import { formatDate } from '@/lib/utils';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  body: any[];
  author: { _id: string; name: string; bio?: string } | null;
  categories: { _id: string; title: string; slug: { current: string } }[] | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) return null;
  return client.fetch(getPostBySlugQuery, { slug });
}

async function getPostSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];
  return client.fetch(getPostSlugsQuery);
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return { title: 'Post non trovato | Blueprint' };
  }

  return {
    title: `${post.title} | Blueprint`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-6 py-24">
        <header className="mb-12">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna al blog
          </Link>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.categories && post.categories.length > 0 && (
              <>
                <span>·</span>
                <span className="text-primary">{post.categories[0].title}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          {post.author && (
            <div className="mt-8 flex items-center gap-4 border-t border-border pt-8">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg font-medium text-muted-foreground">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author.name}</p>
                {post.author.bio && (
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                )}
              </div>
            </div>
          )}
        </header>

        {post.body && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <PortableText value={post.body} />
          </div>
        )}

        <footer className="mt-16 border-t border-border pt-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna al blog
          </Link>
        </footer>
      </article>
    </main>
  );
}
