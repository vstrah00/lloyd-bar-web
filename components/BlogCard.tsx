/* eslint-disable @next/next/no-img-element */
"use client"; // Mark this as a client component

import Link from 'next/link';
import { Blog, Author } from '@/sanity/types';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useTranslations } from 'next-intl';
import { formatDate, formatDateCro } from '@/lib/utils';

export type BlogTypeCard = Omit<Blog, "author"> & { author?: Author };

const BlogCard = ({ post }: { post: BlogTypeCard }) => {
  const { _createdAt, author, pitch, _id, image, category, title } = post;
  const t = useTranslations('BlogCard');

  // Get the current locale from the URL
  const pathname = usePathname();
  const locale = (pathname.split('/')[1] as 'en' | 'hr') || 'en'; // Narrow the type to 'en' | 'hr'

  // Get the content for the current locale
  const blogTitle = title?.[locale] || title?.en || 'No Title';
  const blogPitch = pitch?.[locale] || pitch?.en || ''; // Fallback to English if locale is missing
  const blogCategory = category?.[locale] || category?.en || 'Uncategorized';

  const plainTextPitch = blogPitch
    .replace(/[#*_>`~[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract the first 200 characters of the plain text pitch
  const truncatedPitch = plainTextPitch.slice(0, 200) + (plainTextPitch.length > 200 ? '...' : '');
  const imageSrc = image || '/default-image.webp';

  return (
    <li className='startup-card group'>
      <div className='flex-between'>
        <p className='startup-card_date'>{locale === 'hr' ? formatDateCro(_createdAt) : formatDate(_createdAt)}</p>
      </div>
      <div className='flex-between mt-5 gap-5'>
        <div className='flex-1'>
          <Link href={`/${locale}/user/${author?._id}`}>
            <p>{author?.name}</p>
          </Link>
          <Link href={`/${locale}/blog/${_id}`}>
            <h3 className='text-26-semibold line-clamp-1'>
              {blogTitle} {/* Fallback to English or "No Title" */}
            </h3>
          </Link>
        </div>
        <Link href={`/${locale}/user/${author?._id}`}>
          <img src="https://placehold.co/48x48" alt="" loading="lazy" className="h-12 w-12 rounded-full" />
        </Link>
      </div>
      <Link href={`/${locale}/blog/${_id}`}>
        <p>{truncatedPitch}</p> {/* Display the first 200 characters of the plain text pitch */}
        <div className="relative mt-3 h-[164px] w-full overflow-hidden rounded-[10px]">
          <img src={imageSrc} alt={blogTitle} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className='flex-between gap-3 mt-5'>
        <Link href={`/${locale}?query=${blogCategory.toLowerCase()}`}>
          <p className='text-16-medium'>{blogCategory}</p> {/* Fallback to English or "Uncategorized" */}
        </Link>
        <Link href={`/${locale}/blog/${_id}`} className='startup-card_btn'>
          <p>{t('details')}</p>
        </Link>
      </div>
    </li>
  );
};

export default BlogCard;
