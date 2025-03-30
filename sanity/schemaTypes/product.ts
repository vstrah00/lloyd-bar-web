import { CupSoda } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: CupSoda,
  fields: [
    defineField({
      name: 'name',
      type: 'object',
      title: 'Name',
      fields: [
        { name: 'en', title: 'English', type: 'string' },
        { name: 'hr', title: 'Croatian', type: 'string' },
      ],
      validation: (Rule) => Rule.required().error('Name is required in both languages!'),
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule) => Rule.min(0).required(),
    }),
    defineField({
      name: 'description',
      type: 'object',
      title: 'Description',
      fields: [
        { name: 'en', title: 'English', type: 'text' },
        { name: 'hr', title: 'Croatian', type: 'text' },
      ],
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{ type: 'category' }],
    }),
  ],
  preview: {
    select: {
      title: 'name.en', // Use English name for preview
      subtitle: 'category.name.en', // Use English category for preview
      media: 'image',
    },
  },
});
