import Image from 'next/image';

import type { SanityImage } from '@/types/blog';
import { getBlogImageAlt, getBlogImageSrc } from '@/lib/blog-image';

interface BlogCardImageProps {
  image?: SanityImage;
  title: string;
}

export function BlogCardImage({
  image,
  title,
}: BlogCardImageProps): React.ReactElement {
  return (
    <div className="relative aspect-[357/275] overflow-hidden rounded-[12px] bg-[var(--landing-panel)]">
      <Image
        src={getBlogImageSrc(image, 600, 340)}
        alt={getBlogImageAlt(image, title)}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 rounded-[12px] border border-white/10" />
    </div>
  );
}
