import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  title: string;
  slug: string;
}

export function CategoryBadge({
  title,
  slug,
}: CategoryBadgeProps): React.ReactElement {
  return (
    <Link href={`/blog/category/${slug}`}>
      <Badge variant="secondary" className="hover:bg-secondary/80">
        {title}
      </Badge>
    </Link>
  );
}
