import Image from 'next/image';
import { format } from 'date-fns';

import type { SanityImage } from '@/types/blog';
import { urlForImage } from '@/sanity/lib/image';

interface BlogCardMetaProps {
  authorName: string;
  authorImage?: SanityImage;
  publishedAt: string;
}

export function BlogCardMeta({
  authorName,
  authorImage,
  publishedAt,
}: BlogCardMetaProps): React.ReactElement {
  const avatarUrl = authorImage
    ? urlForImage(authorImage).width(32).height(32).url()
    : null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={authorName}
          width={24}
          height={24}
          className="rounded-full"
        />
      ) : (
        <div className="size-6 rounded-full bg-muted" />
      )}
      <span className="font-medium">{authorName}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={publishedAt}>
        {format(new Date(publishedAt), 'MMM d, yyyy')}
      </time>
    </div>
  );
}
