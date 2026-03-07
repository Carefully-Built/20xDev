
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
        {title ?? Blog}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground md:text-base">
        {description ?? (
          Insights, tutorials, and updates
        )}
      </p>
    </div>
  );
}
