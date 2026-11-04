'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import NonIntrusiveTitleDesc from './NonIntrusiveTitleDesc';
import { FaGlassMartiniAlt, FaChevronDown, FaChevronUp, FaInfoCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import {menuText, type MenuCategory, type MenuLocale, type MenuProduct} from "@/lib/menu";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

// Function to get the URL from the Sanity image object
function urlFor(source: NonNullable<MenuProduct['image']>) {
  return builder.image(source);
}

type MenuClientProps = {
  products: MenuCategory[] | undefined;
  locale: MenuLocale;
};

const MenuClient: React.FC<MenuClientProps> = ({ products = [], locale }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  // Handle toggle for categories
  const toggleCategory = (categoryId: string) => {
    const isOpening = openCategory !== categoryId;
    setOpenCategory(openCategory === categoryId ? null : categoryId);

    // Scroll to category header when opening
    if (isOpening) {
      setTimeout(() => {
        const categoryElement = document.getElementById(`category-${categoryId}`);
        if (categoryElement) {
          // Responsive offset: 80px mobile, 120px desktop + 20px padding
          const isMobile = window.innerWidth < 768;
          const navbarOffset = isMobile ? 60 : 120;
          const offsetTop = categoryElement.offsetTop - (navbarOffset + 20);

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }, 150); // Half of animation duration to start scrolling mid-animation
    }
  };

  // Handle showing/hiding product description
  const toggleDescription = (productId: string) => {
    setActiveProduct(activeProduct === productId ? null : productId);
  };

  const tMenu = useTranslations("Menu");
  const t = useTranslations("QrMenu");

  return (
    <>
      {/* Title Section */}
      <section className='mt-[90px] md:mt-[140px]'>
        <NonIntrusiveTitleDesc
          title={tMenu("heading")}
          description={tMenu("subheading")}
          icon={<FaGlassMartiniAlt />}
        />
      </section>

      {/* Menu Container */}
      <section className="max-w-4xl mx-auto pt-1 pb-8 px-4 md:px-6">
        {/* Check if products are not empty before rendering */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
              <FaGlassMartiniAlt className="text-neutral-400 text-xl" />
            </div>
            <p className="text-lg text-neutral-500 font-medium">{t("empty")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((category) => (
              <div key={category._id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                {/* Category Header */}
                <button
                  id={`category-${category._id}`}
                  className="w-full p-6 text-left hover:bg-neutral-50 transition-all duration-200 focus:outline-none"
                  onClick={() => {
                    toggleCategory(category._id);
                    setActiveProduct(null);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-800">
                      {menuText(category.name, locale, t("unnamedCategory"))}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-neutral-500 font-medium">
                        {t("items", {count: category.products.length})}
                      </span>
                      {openCategory === category._id ? (
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
                    openCategory === category._id
                      ? 'max-h-none opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-neutral-100 bg-neutral-50/50">
                    <div className="p-4 space-y-4">
                      {category.products.map((product) => {
                        const name = menuText(product.name, locale, t("unnamedProduct"));
                        const description = menuText(product.description, locale);
                        return (
                          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                            {/* Product Main Info */}
                            <div className="p-5">
                              <div className="flex items-start space-x-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                                  {product.image?.asset?._ref ? <Image
                                    src={urlFor(product.image).width(200).url()}
                                    alt={name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                  /> : <div className="flex h-full items-center justify-center"><FaGlassMartiniAlt className="text-neutral-400" aria-hidden="true" /></div>}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg md:text-xl font-semibold text-neutral-800 leading-tight">
                                      {name}
                                    </h3>
                                    <div className="flex-shrink-0 ml-4">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-100 text-primary-800">
                                        {product.price}€
                                      </span>
                                    </div>
                                  </div>

                                  {/* Description Toggle Button */}
                                  {description && <button
                                    onClick={() => toggleDescription(product._id)}
                                    className="inline-flex items-center space-x-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200 focus:outline-none"
                                  >
                                    <FaInfoCircle className="text-xs" />
                                    <span className="font-medium">
                                      {activeProduct === product._id ? t('hideDetails') : t('viewDetails')}
                                    </span>
                                  </button>}
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
                                    {description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom CSS for smooth animations */}
      <style jsx>{`
        /* Additional smooth transition styles */
        .transition-all {
          transition-property: max-height, opacity, margin-top;
        }
      `}</style>
    </>
  );
};

export default MenuClient;
