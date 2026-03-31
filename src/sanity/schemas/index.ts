
import { author } from './author';
import { blockContent } from './block-content';
import { category } from './category';
import { post } from './post';

import type { SchemaTypeDefinition } from 'sanity';

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  author,
  blockContent,
];
