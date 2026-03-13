import { cn } from '@/lib/utils';

interface LandingSectionHeadingProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly centered?: boolean;
  readonly hero?: boolean;
  readonly className?: string;
  readonly titleClassName?: string;
  readonly descriptionClassName?: string;
}

export function LandingSectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
  hero = false,
  className,
  titleClassName,
  descriptionClassName,
}: LandingSectionHeadingProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow ? (
        <p className="landing-eyebrow">
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cn(
          hero ? 'landing-hero-title' : 'landing-section-title',
          titleClassName
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            hero ? 'landing-hero-description' : 'landing-section-description',
            descriptionClassName
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
