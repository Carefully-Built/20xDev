import { defineField } from 'sanity';

export function requiredStringField(name: string, title: string): ReturnType<typeof defineField> {
  return defineField({
    name,
    title,
    type: 'string',
    validation: (rule) => rule.required(),
  });
}

export function slugField(source: string): ReturnType<typeof defineField> {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });
}

export function textField(
  name: string,
  title: string,
  rows: number,
): ReturnType<typeof defineField> {
  return defineField({
    name,
    title,
    type: 'text',
    rows,
  });
}
