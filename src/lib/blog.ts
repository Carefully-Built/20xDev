import type { PortableTextBlock } from '@portabletext/react';

export function getBlogReadingTime(body: PortableTextBlock[] | undefined): number {
  if (!body) {
    return 1;
  }

  return Math.max(1, Math.ceil(JSON.stringify(body).length / 1500));
}

export function getExcerptReadingTime(excerpt: string): number {
  const words = excerpt.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 45));
}
