import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'hr', title: 'Croatian', type: 'string' },
      ],
      validation: (Rule) => Rule.required().error('Name is required in both languages!'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'name.en', // Use English name for slug generation
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name.en', // Use English name for preview
    },
  },
});
