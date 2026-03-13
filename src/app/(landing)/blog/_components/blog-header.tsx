import Link from 'next/link';
import { T } from 'gt-next';

interface BlogHeaderProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function BlogHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: BlogHeaderProps): React.ReactElement {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-[2.35rem] leading-none tracking-[-0.06em] text-[var(--landing-ink)] md:text-[3.05rem]">
          {title ?? <T id="blog.title">Blog</T>}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--landing-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-[1.05rem] tracking-[-0.03em] text-[var(--landing-ink)] transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
