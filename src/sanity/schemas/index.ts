import type { SchemaTypeDefinition } from 'sanity';

import { author } from './author';
import { blockContent } from './block-content';
import { category } from './category';
import { post } from './post';

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  author,
  blockContent,
];
