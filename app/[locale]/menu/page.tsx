// app/[locale]/menu/page.tsx
import React from 'react';
import { client } from '@/sanity/lib/client';
import { CATEGORY_QUERY } from '@/sanity/lib/queries';
import MenuClient from '@/components/MenuClient';

// Define the types for product and category (Keep these)
type Product = {
  _id: string;
  name: {
    en: string;
    hr: string;
  };
  price: number;
  description: {
    en: string;
    hr: string;
  };
  image: {
    asset: {
      _ref: string;
    };
  };
};

type Category = {
  _id: string;
  name: {
    en: string;
    hr: string;
  };
  products: Product[];
};

type Locale = 'en' | 'hr';

export const revalidate = 20;

// *** 1. DEFINE PageProps TYPE with params as Promise ***
type PageProps = {
  params: Promise<{ locale: string; }>;
};

// *** 2. RENAME component to MenuPage (conventional) and USE PageProps ***
export default async function MenuPage({ params }: PageProps) {
  // *** 3. USE await params (matches the Promise type) ***
  const { locale: stringLocale } = await params;

  // Validate and cast locale (Keep this)
  const locale = (stringLocale === 'en' || stringLocale === 'hr' ? stringLocale : 'en') as Locale;

  // Fetch the data (Keep this - consider renaming variable if needed)
  const categories: Category[] = await client.fetch(CATEGORY_QUERY); // Assuming CATEGORY_QUERY returns Category[]

  // Pass the fetched data and locale to the Client Component
  return <MenuClient products={categories} locale={locale} />; // Pass categories if that's the correct data structure
}