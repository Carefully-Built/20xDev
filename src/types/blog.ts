import type { PortableTextBlock } from '@portabletext/react';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt: string;
  caption?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImage;
  bio?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  author: Author;
  mainImage?: SanityImage;
  categories: Category[];
  publishedAt: string;
  excerpt: string;
  body?: PortableTextBlock[];
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: { current: string };
  author: Pick<Author, 'name' | 'image'>;
  mainImage?: SanityImage;
  categories: Pick<Category, 'title' | 'slug'>[];
  publishedAt: string;
  excerpt: string;
}
