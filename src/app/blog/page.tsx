import { Metadata } from 'next';
import Link from 'next/link';
import { client, isSanityConfigured } from '@/sanity/lib/client';
import { getPostsQuery, getPostCountQuery } from '@/sanity/lib/queries';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog | Blueprint',
  description: 'Articoli su design, sviluppo e best practices per costruire prodotti digitali eccezionali.',
};

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  author: { name: string } | null;
  categories: { title: string; slug: { current: string } }[] | null;
}

async function getPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return [];
  return client.fetch(getPostsQuery, { offset: 0, limit: 20 });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Articoli su design, sviluppo e best practices per costruire prodotti digitali eccezionali.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Nessun articolo ancora. Torna presto!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post._id} className="group">
                <Link href={`/blog/${post.slug.current}`} className="block">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                      {post.categories && post.categories.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{post.categories[0].title}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      {post.author && (
                        <span className="text-muted-foreground">
                          di {post.author.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
