"use client"; // Mark this as a client component

import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Blog, Author } from '@/sanity/types';
import { usePathname } from 'next/navigation'; // Import usePathname
import markdownit from 'markdown-it'; // Import markdown-it

export type BlogTypeCard = Omit<Blog, "author"> & { author?: Author };

const BlogCard = ({ post }: { post: BlogTypeCard }) => {
  const { _createdAt, author, pitch, _id, image, category, title } = post;

  // Get the current locale from the URL
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] as 'en' | 'hr') || 'en'; // Narrow the type to 'en' | 'hr'

  // Get the content for the current locale
  const blogTitle = title?.[locale] || title?.en || 'No Title';
  const blogPitch = pitch?.[locale] || pitch?.en || ''; // Fallback to English if locale is missing
  const blogCategory = category?.[locale] || category?.en || 'Uncategorized';

  console.log('raw:'+blogPitch);

  // Initialize markdown-it
  const md = markdownit();

  // Convert markdown to plain text
  const plainTextPitch = md.render(blogPitch).replace(/<[^>]*>/g, ''); // Strip HTML tags
  console.log('Plain:'+plainTextPitch);

  // Extract the first 200 characters of the plain text pitch
  const truncatedPitch = plainTextPitch.slice(0, 200) + (plainTextPitch.length > 200 ? '...' : '');
  console.log('Pitch:'+truncatedPitch);

  return (
    <li className='startup-card group'>
      <div className='flex-between'>
        <p className='startup_card_date'>{formatDate(_createdAt)}</p>
      </div>
      <div className='flex-between mt-5 gap-5'>
        <div className='flex-1'>
          <Link href={`/user/${author?._id}`}>
            <p>{author?.name}</p>
          </Link>
          <Link href={`/blog/${_id}`}>
            <h3 className='text-26-semibold line-clamp-1'>
              {blogTitle} {/* Fallback to English or "No Title" */}
            </h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image src="https://placehold.co/48x48" alt="placeholder" width={48} height={48} className='rounded-full' />
        </Link>
      </div>
      <Link href={`/blog/${_id}`}>
        <p>{truncatedPitch}</p> {/* Display the first 200 characters of the plain text pitch */}
        <img src={image || 'https://placehold.co/600x400'} alt='placeholder' className='startup-card_img' />
      </Link>
      <div className='flex-between gap-3 mt-5'>
        <Link href={`/?query=${blogCategory.toLowerCase()}`}>
          <p className='text-16-medium'>{blogCategory}</p> {/* Fallback to English or "Uncategorized" */}
        </Link>
        <Link href={`/blog/${_id}`} className='startup-card_btn'>
          <p>Details</p>
        </Link>
      </div>
    </li>
  );
};

export default BlogCard;