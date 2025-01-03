import { formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Author, Blog } from '@/sanity/types'

export type BlogTypeCard = Omit<Blog, "author"> & {author?:Author}

const BlogCard = ({post}:{post:BlogTypeCard}) => {
    const {_createdAt, views, author, description, _id, image, category, title} = post;

  return (
    <li className='startup-card group'>
        <div className='flex-between'>
            <p className='startup_card_date'>
                {formatDate(post._createdAt)}
            </p>
            <div className='flex gap-1.5'>
                <EyeIcon className='size-6' />
                <span className='text-16-medium'>{views}</span>
            </div>
        </div>
        <div className='flex-between mt-5 gap-5'>
            <div className='flex-1'>
                <Link href={`/user/${author?._id}`}>
                    <p>{author?.name}</p>
                </Link>
                <Link href={`/blog/${_id}`}>
                    <h3 className='text-26-semibold line-clamp-1'>
                        {title}
                    </h3>
                </Link>
            </div>
            <Link href={`/user/${author?._id}`}>
                <Image src="https://placehold.co/48x48" alt="placeholder" width={48} height={48} className='rounded-full'/>
            </Link>
        </div>
        <Link href={`/blog/${_id}`}>
            <p>{description}</p>
            <img src={image} alt='placeholder' className='startup-card_img'/>
        </Link>
        <div className='flex-between gap-3 mt-5'>
            <Link href={`/?query=${category?.toLowerCase()}`}>
                <p className='text-16-medium'>{category}</p>
            </Link>
            <Link href={`/blog/${_id}`} className='startup-card_btn'>
                <p>Details</p>
            </Link>
        </div>
    </li>
  )
}

export default BlogCard