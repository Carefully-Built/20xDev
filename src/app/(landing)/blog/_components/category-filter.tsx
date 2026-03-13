'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { T } from 'gt-next';

interface CategoryItem {
  title: string;
  slug: { current: string };
}

interface CategoryFilterProps {
  categories: CategoryItem[];
}

export function CategoryFilter({
  categories,
}: CategoryFilterProps): React.ReactElement {
  const pathname = usePathname();

  const isAll = pathname === '/blog' || pathname.endsWith('/blog');

  return (
    <nav
      className="mb-10 flex gap-2 overflow-x-auto pb-2 md:mb-12"
      aria-label="Category filter"
    >
      <Link href="/blog">
        <span
          className={[
            'inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm transition-colors',
            isAll
              ? 'border-[color:color-mix(in_oklab,var(--landing-ink)_12%,white)] bg-white/70 text-[var(--landing-ink)]'
              : 'border-transparent bg-transparent text-[var(--landing-muted)] hover:border-[color:color-mix(in_oklab,var(--landing-ink)_8%,white)] hover:bg-white/45 hover:text-[var(--landing-ink)]',
          ].join(' ')}
        >
          <T id="blog.allCategories">All</T>
        </span>
      </Link>
      {categories.map((cat) => {
        const isActive = pathname === `/blog/category/${cat.slug.current}`;
        return (
          <Link key={cat.slug.current} href={`/blog/category/${cat.slug.current}`}>
            <span
              className={[
                'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 text-sm transition-colors',
                isActive
                  ? 'border-[color:color-mix(in_oklab,var(--landing-ink)_12%,white)] bg-white/70 text-[var(--landing-ink)]'
                  : 'border-transparent bg-transparent text-[var(--landing-muted)] hover:border-[color:color-mix(in_oklab,var(--landing-ink)_8%,white)] hover:bg-white/45 hover:text-[var(--landing-ink)]',
              ].join(' ')}
            >
              {cat.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
