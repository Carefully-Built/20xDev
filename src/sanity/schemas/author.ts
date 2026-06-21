import { defineField, defineType } from 'sanity';

import { requiredStringField, slugField, textField } from './field-helpers';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    requiredStringField('name', 'Name'),
    slugField('name'),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    textField('bio', 'Bio', 3),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
