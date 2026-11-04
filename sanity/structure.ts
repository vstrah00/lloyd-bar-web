import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('blog').title('Blog'),
      S.documentTypeListItem('product').title('Products').child(
        S.documentTypeList('product').title('Products').defaultOrdering([
          {field: 'sortOrder', direction: 'asc'},
          {field: 'name.en', direction: 'asc'},
          {field: '_id', direction: 'asc'},
        ]),
      ),
      S.documentTypeListItem('category').title('Categories').child(
        S.documentTypeList('category').title('Categories').defaultOrdering([
          {field: 'sortOrder', direction: 'asc'},
          {field: 'name.en', direction: 'asc'},
          {field: '_id', direction: 'asc'},
        ]),
      ),
      S.listItem().title('Products by category').child(
        S.documentTypeList('category').title('Choose a category')
          .defaultOrdering([{field: 'sortOrder', direction: 'asc'}, {field: 'name.en', direction: 'asc'}])
          .child((categoryId) =>
            S.documentList().title('Products').schemaType('product')
              .filter('_type == "product" && category._ref == $categoryId')
              .params({categoryId: categoryId.replace(/^drafts\./, '')})
              .defaultOrdering([{field: 'sortOrder', direction: 'asc'}, {field: 'name.en', direction: 'asc'}]),
          ),
      ),
      S.documentTypeListItem('galleryImage').title('Gallery'),
    ])
