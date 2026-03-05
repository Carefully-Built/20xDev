import { groq } from 'next-sanity';

const postListFields = `
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  "author": author->{ name, image },
  "categories": categories[]->{ title, slug }
`;

export const getPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [$offset...$limit] {
    ${postListFields}
  }
`;

export const getPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    body,
    "author": author->{ _id, name, slug, image, bio },
    "categories": categories[]->{ _id, title, slug, description }
  }
`;

export const getPostsByCategoryQuery = groq`
  *[_type == "post" && references(
    *[_type == "category" && slug.current == $categorySlug]._id
  )] | order(publishedAt desc) {
    ${postListFields}
  }
`;

export const getCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id, title, slug, description
  }
`;

export const getPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const getCategorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)].slug.current
`;

export const getPostCountQuery = groq`
  count(*[_type == "post"])
`;
