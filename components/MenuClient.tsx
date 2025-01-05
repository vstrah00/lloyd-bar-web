'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

// Function to get the URL from the Sanity image object
function urlFor(source: any) {
  return builder.image(source);
}

// Define the types for product and category
type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: {
    asset: {
      _ref: string; // This is the reference ID to the image asset
    };
  };
};

type Category = {
  name: string;
  products: Product[];
};

type MenuClientProps = {
  products: Category[] | undefined;  // Allow products to be undefined initially
};

const MenuClient: React.FC<MenuClientProps> = ({ products = [] }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  // Handle toggle for categories
  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  // Handle showing/hiding product description
  const toggleDescription = (productId: string) => {
    setActiveProduct(activeProduct === productId ? null : productId);
  };

  return (
    <section className="section_container py-8 px-4 md:px-8">
      {/* Check if products are not empty before rendering */}
      {products.length === 0 ? (
        <p className="text-center text-20-medium text-gray-700">No products available</p>
      ) : (
        products.map((category) => (
          <div key={category.name} className="category my-6">
            {/* Category Header */}
            <h2
              className="category-title text-30-semibold cursor-pointer text-black hover:text-primary transition-colors"
              onClick={() => toggleCategory(category.name)}
            >
              {category.name}
            </h2>

            {/* Category Products (toggle visibility on category click) */}
            {openCategory === category.name && (
              <ul className="product-list mt-4 space-y-4">
                {category.products.map((product) => (
                  <li key={product._id} className="product-card bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4 hover:shadow-xl transition-shadow">
                    <div
                      className="product-card-header flex items-center space-x-4 cursor-pointer"
                      onClick={() => toggleDescription(product._id)}
                    >
                      {/* Product Image, Name, and Price */}
                      <Image
                        src={urlFor(product.image).width(200).url()}  // Pass the whole image object
                        alt={product.name}
                        width={100}
                        height={100}
                        className="product-image w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="product-details flex-1">
                        <h3 className="product-name text-20-medium font-semibold text-black">{product.name}</h3>
                        <p className="product-price text-16-medium text-gray-600">${product.price}</p>
                      </div>
                    </div>

                    {/* Product Description (toggle visibility) */}
                    {activeProduct === product._id && (
                      <p className="product-description text-14-normal text-black-200 mt-2">{product.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </section>
  );
};

export default MenuClient;
