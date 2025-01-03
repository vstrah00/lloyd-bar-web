import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { blog } from './blog'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, blog],
}
