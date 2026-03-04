'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { T } from 'gt-next';

import { Badge } from '@/components/ui/badge';

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

  const isAll = pathname === '/blog';

  return (
    <nav
      className="mb-8 flex gap-2 overflow-x-auto pb-2"
      aria-label="Category filter"
    >
      <Link href="/blog">
        <Badge
          variant={isAll ? 'default' : 'outline'}
          className="min-h-[44px] px-4 text-sm"
        >
          <T id="blog.allCategories">All</T>
        </Badge>
      </Link>
      {categories.map((cat) => {
        const isActive = pathname === `/blog/category/${cat.slug.current}`;
        return (
          <Link key={cat.slug.current} href={`/blog/category/${cat.slug.current}`}>
            <Badge
              variant={isActive ? 'default' : 'outline'}
              className="min-h-[44px] px-4 text-sm whitespace-nowrap"
            >
              {cat.title}
            </Badge>
          </Link>
        );
      })}
    </nav>
  );
}
