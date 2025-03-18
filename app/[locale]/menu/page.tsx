import React from 'react';
import { client } from '@/sanity/lib/client';
import { CATEGORY_QUERY } from '@/sanity/lib/queries';
import MenuClient from '@/components/MenuClient';

// Define the types for product and category
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
      _ref: string; // This is the reference ID to the image asset
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

type Locale = 'en' | 'hr'; // Define Locale type explicitly

export const revalidate = 20;

// Define the Server Component to fetch data
export default async function MenuServer({ params }: { params: { locale: string } }) {
  // Await the params object
  const { locale: stringLocale } = await params;

  // Validate and cast locale to 'Locale' type
  const locale = (stringLocale === 'en' || stringLocale === 'hr' ? stringLocale : 'en') as Locale;

  // Fetch the data in the server component
  const products: Category[] = await client.fetch(CATEGORY_QUERY);

  // Pass the fetched data and locale to the Client Component as props
  return <MenuClient products={products} locale={locale} />;
}
