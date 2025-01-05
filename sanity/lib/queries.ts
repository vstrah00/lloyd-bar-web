import { defineQuery } from "next-sanity";


export const BLOG_QUERY = defineQuery(`
            *[_type=="blog" && !defined($search) || title match $search || category match $search || description match $search] | order(_createdAt desc){
                _id, title, slug, _createdAt, views,
                description, category, image,
                author -> {
                    _id, name, image, bio
                }
            }
    `)


export const BLOG_BY_ID_QUERY = defineQuery(`
            *[_type=="blog" && _id==$id][0]{
                _id, title, slug, _createdAt, views,
                description, category, image, pitch,
                author -> {
                    _id, name, image, bio, username
                }
            }
    `)

export const PRODUCT_QUERY = defineQuery(`
            *[_type=="product"]{
                _id, name, price, description
            }
    `)



export const CATEGORY_QUERY = defineQuery(`
    *[_type == "category"] {
        name,
        "products": *[_type == "product" && references(^._id)] {
        _id, name, price, description, image
        }
    }
`);

