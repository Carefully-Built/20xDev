import { T } from 'gt-next';

interface BlogHeaderProps {
  title?: string;
  description?: string;
}

export function BlogHeader({
  title,
  description,
}: BlogHeaderProps): React.ReactElement {
  return (
    <div className="mb-8 text-center md:mb-12">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {title ?? <T id="blog.title">Blog</T>}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground md:text-base">
        {description ?? (
          <T id="blog.description">Insights, tutorials, and updates</T>
        )}
      </p>
    </div>
  );
}
