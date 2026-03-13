import type { SanityImage } from '@/types/blog';

import { urlForImage } from '@/sanity/lib/image';

const BLOG_FALLBACK_IMAGE = '/images/blog-placeholder.svg';

export function getBlogImageSrc(
  image: SanityImage | undefined,
  width: number,
  height: number,
): string {
  if (!image) {
    return BLOG_FALLBACK_IMAGE;
  }

  return urlForImage(image).width(width).height(height).url();
}

export function getBlogImageAlt(
  image: SanityImage | undefined,
  title: string,
): string {
  return image?.alt ?? `${title} cover image`;
}
