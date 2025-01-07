// MenuServer.tsx
import React from 'react';
import { client } from '@/sanity/lib/client';
import { CATEGORY_QUERY } from '@/sanity/lib/queries';
import MenuClient from '@/components/MenuClient';

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
  

export const revalidate = 20; // Revalidate every 60 seconds

// Define the Server Component to fetch data
export default async function MenuServer() {
  // Fetch the data in the server component
  const products: Category[] = await client.fetch(CATEGORY_QUERY);

  // Pass the fetched data to the Client Component as props
  return <MenuClient products={products} />;
}
