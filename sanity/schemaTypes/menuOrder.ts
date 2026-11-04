import {defineField} from 'sanity'

export const menuOrderField = defineField({
  name: 'sortOrder',
  title: 'Menu order',
  type: 'number',
  description: 'Lower numbers appear first. Use 10, 20, 30 to leave room between items. Products are ordered within their category. Publish to update the website.',
  initialValue: 1000,
  validation: (Rule) => Rule.integer().min(0),
})

export const menuOrderings = [
  {
    title: 'Menu order',
    name: 'menuOrder',
    by: [
      {field: 'sortOrder', direction: 'asc' as const},
      {field: 'name.en', direction: 'asc' as const},
      {field: '_id', direction: 'asc' as const},
    ],
  },
  {
    title: 'Name (English)',
    name: 'nameEnglish',
    by: [{field: 'name.en', direction: 'asc' as const}],
  },
]
