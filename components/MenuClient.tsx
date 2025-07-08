'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import NonIntrusiveTitleDesc from './NonIntrusiveTitleDesc';
import { FaChevronDown, FaChevronUp, FaGlassMartiniAlt, FaInfoCircle } from "react-icons/fa"; // Example icon, you can choose another icon
import { useTranslations } from "next-intl";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

// Function to get the URL from the Sanity image object
function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

// Define the types for product and category
type LocalizedString = {
  en: string;
  hr: string;
};

type Product = {
  _id: string;
  name: LocalizedString;
  price: number;
  description: LocalizedString;
  image: {
    asset: {
      _ref: string; // This is the reference ID to the image asset
    };
  };
};

type Category = {
  _id: string;
  name: LocalizedString;
  products: Product[];
};

type Locale = 'en' | 'hr';

type MenuClientProps = {
  products: Category[] | undefined; // Allow products to be undefined initially
  locale: Locale; // Current locale
};

const MenuClient: React.FC<MenuClientProps> = ({ products = [], locale }) => {
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

  const tMenu = useTranslations("Menu");
  
  return (
    <>
      {/*Add a section here thats gonna be a tittle and some description for my drinks menu*/}
      <section className='mt-[90px] md:mt-[140px]'>
        <NonIntrusiveTitleDesc
          title={tMenu("heading")}
          description={tMenu("subheading")}
          icon={<FaGlassMartiniAlt />} // You can use any icon here
        />
        </section>

      <section className="pricelist_container py-12 px-4 md:px-8 bg-neutral-100/80 rounded-lg shadow-md mb-8">
        {/* Check if products are not empty before rendering */}
        {products.length === 0 ? (
          <p className="text-center text-20-medium text-neutral-500">No products available</p>
        ) : (
          <div className="space-y-6">
            {products.map((category) => (
              <div key={category._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                {/* Category Header */}
                <button
                  id={`category-${category.name.en}`}
                  className="w-full p-6 text-left hover:bg-neutral-50 transition-all duration-200 focus:outline-none"
                  onClick={() => {
                    toggleCategory(category.name.en);
                    setActiveProduct(null);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-800">
                      {category.name[locale]}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500 font-medium">
                        {category.products.length} items
                      </span>
                      {openCategory === category.name.en ? (
                        <FaChevronUp className="text-neutral-400 text-sm transition-transform duration-300 ease-in-out" />
                      ) : (
                        <FaChevronDown className="text-neutral-400 text-sm transition-transform duration-300 ease-in-out" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Category Products */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openCategory === category.name.en 
                      ? 'max-h-none opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-neutral-100 bg-neutral-50/50">
                    <div className="p-4 space-y-4">
                      {category.products.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                          {/* Product Main Info */}
                          <div className="p-5">
                            <div className="flex items-start space-x-4">
                              {/* Product Image */}
                              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                                <Image
                                  src={urlFor(product.image).width(200).url()}
                                  alt={product.name[locale]}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg md:text-xl font-semibold text-neutral-800 leading-tight">
                                    {product.name[locale]}
                                  </h3>
                                  <div className="flex-shrink-0 ml-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-100 text-primary-800">
                                      {product.price}€
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Description Toggle Button */}
                                <button
                                  onClick={() => toggleDescription(product._id)}
                                  className="inline-flex items-center space-x-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200 focus:outline-none"
                                >
                                  <FaInfoCircle className="text-xs" />
                                  <span className="font-medium">
                                    {activeProduct === product._id ? 'Hide details' : 'View details'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Product Description */}
                            <div 
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                activeProduct === product._id 
                                  ? 'max-h-96 opacity-100 mt-4' 
                                  : 'max-h-0 opacity-0 mt-0'
                              }`}
                            >
                              <div className="pt-4 border-t border-neutral-100">
                                <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                                  {product.description[locale]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default MenuClient;
