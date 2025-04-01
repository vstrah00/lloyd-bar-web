// src/components/CheersSection.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import BeerMugAnimation from './BeerMugAnimation';

const CheersSection = () => {
  const t = useTranslations('CheersSection');

  return (
    <section className="cheers-section pt-12 pb-7 md:pb-10 md:pt-24 overflow-hidden flex items-center justify-center min-h-[30vh]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center md:gap-12 w-full">
        {/* Text Content - Centered on all screens */}
        <div className="text-content w-full md:w-1/2 text-center order-2 md:order-1">
          <div className="max-w-lg mx-auto"> {/* Centered container */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-work-sans leading-tight">
              {t('heading')}
            </h2>
            <p className="text-lg text-gray-300 mb-6 mx-auto max-w-md">
              {t('description')}
            </p>
            <div className="flex justify-center">
              <Link
                href="/menu"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                {t('menuButton')}
              </Link>
            </div>
          </div>
        </div>

        {/* Animation Container - Centered on all screens */}
        <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
          <div className="w-full max-w-xs h-64 flex items-center justify-center">
            <BeerMugAnimation/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheersSection;