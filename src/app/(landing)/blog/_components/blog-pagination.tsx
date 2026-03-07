import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  basePath = '/blog',
}: BlogPaginationProps): React.ReactElement | null {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-4"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Button variant="outline" asChild className="min-h-[44px]">
          <Link href={`${basePath}?page=${currentPage - 1}`}>
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <div className="min-h-[44px] min-w-[100px]" aria-hidden="true" />
      )}
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Button variant="outline" asChild className="min-h-[44px]">
          <Link href={`${basePath}?page=${currentPage + 1}`}>
            Next
            <ChevronRight className="ml-1 size-4" />
          </Link>
        </Button>
      ) : (
        <div className="min-h-[44px] min-w-[100px]" aria-hidden="true" />
      )}
    </nav>
  );
}
