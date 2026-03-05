import Image from 'next/image';

import type { SanityImage } from '@/types/blog';
import { urlForImage } from '@/sanity/lib/image';

interface BlogCardImageProps {
  image: SanityImage;
  title: string;
}

export function BlogCardImage({
  image,
  title,
}: BlogCardImageProps): React.ReactElement {
  const imageUrl = urlForImage(image).width(600).height(340).url();

  return (
    <div className="relative aspect-video overflow-hidden rounded-t-xl">
      <Image
        src={imageUrl}
        alt={image.alt ?? title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
