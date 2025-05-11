import { defineQuery } from "next-sanity";


export const BLOG_QUERY = defineQuery(`
    *[_type == "blog" && (!defined($search) || title.en match $search || title.hr match $search || description.en match $search || description.hr match $search || category.en match $search || category.hr match $search)] | order(_createdAt desc) {
      _id, 
      title, 
      slug, 
      _createdAt, 
      views,
      description, 
      category, 
      image,
      pitch,
      author -> {
        _id, name, image, bio
      }
    }
  `);

export const BLOG_BY_ID_QUERY = defineQuery(`
*[_type == "blog" && _id == $id][0] {
    _id, 
    title, // Fetch the entire title object
    slug, 
    _createdAt, 
    views,
    description, // Fetch the entire description object
    category, // Fetch the entire category object
    image, 
    pitch, // Fetch the entire pitch object
    author -> {
    _id, name, image, bio, username
    }
}
`);

export const PRODUCT_QUERY = defineQuery(`
            *[_type=="product"]{
                _id, name, price, description
            }
    `)



export const CATEGORY_QUERY = defineQuery(`
  *[_type == "category"] {
    _id,
    name,
    "products": *[_type == "product" && references(^._id)] | order(_updatedAt desc) {
      _id,
      name,
      price,
      description,
      image,
      _updatedAt
    }
  }
`);
    

