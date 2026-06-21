import { defineType } from 'sanity';

import { requiredStringField, slugField, textField } from './field-helpers';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    requiredStringField('title', 'Title'),
    slugField('title'),
    textField('description', 'Description', 2),
  ],
});
