import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { blog } from './blog'
import { product } from './product'
import { category } from './category'
import { galleryImage } from './galleryImage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, blog, product, category, galleryImage],
}
