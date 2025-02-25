'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

// Function to get the URL from the Sanity image object
function urlFor(source: { asset: { _ref: string } }) {
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
  products: Category[] | undefined; // Allow products to be undefined initially
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
    <section className="section_container py-12 px-4 md:px-8 bg-neutral-100">
      {/* Check if products are not empty before rendering */}
      {products.length === 0 ? (
        <p className="text-center text-20-medium text-neutral-500">No products available</p>
      ) : (
        products.map((category) => (
          <div key={category.name} className="category mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Category Header */}
            <div
              className="category-header p-6 mb-2 cursor-pointer hover:bg-neutral-200 transition-colors"
              onClick={() => {
                toggleCategory(category.name);
                setActiveProduct(null); // Reset active product when category is toggled
              }}
            >
              <h2 className="text-2xl font-bold text-primary-dark flex items-center justify-between">
                {category.name}
                <span className="text-neutral-500 text-lg transition-transform transform rotate-0">
                  {openCategory === category.name ? '▲' : '▼'}
                </span>
              </h2>
            </div>

            {/* Category Products (toggle visibility on category click) */}
            {openCategory === category.name && (
              <ul className="product-list p-6 pt-0 space-y-6">
                {category.products.map((product) => (
                  <li key={product._id} className="product-card">
                    <div
                      className="product-card-header flex items-start space-x-6 cursor-pointer hover:bg-neutral-50 transition-colors p-4 rounded-lg"
                      onClick={() => toggleDescription(product._id)}
                    >
                      {/* Product Image */}
                      <div className="product-image w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={urlFor(product.image).width(200).url()} // Pass the whole image object
                          alt={product.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Name and Price */}
                      <div className="product-details flex-1">
                        <h3 className="text-xl font-semibold text-neutral-800">{product.name}</h3>
                        <p className="text-lg font-medium text-secondary-dark mt-1">{product.price}€</p>
                      </div>
                    </div>

                    {/* Product Description (toggle visibility) */}
                    {activeProduct === product._id && product.description && (
                      <p className="text-base text-neutral-600 mt-4 pl-30">{product.description}</p>
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