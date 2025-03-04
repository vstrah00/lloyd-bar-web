import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { BLOG_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import markdownit from 'markdown-it';

const page = async ({ params }: { params: Promise<{ id: string; locale: string }> }) => {
  const { id, locale } = await params;
  const md = markdownit();

  // Fetch the post
  const post = await client.fetch(BLOG_BY_ID_QUERY, { id });

  if (!post) return notFound();

  // Determine the locale from the URL
  const lang = locale || 'en'; // Default to 'en' if locale is missing

  // Get the content for the current locale
  const title = post.title?.[lang] || post.title?.en || 'No Title';
  const description = post.description?.[lang] || post.description?.en || 'No Description';
  const category = post.category?.[lang] || post.category?.en || 'Uncategorized';
  const pitchContent = post.pitch?.[lang] || post.pitch?.en || ''; // Fallback to English if locale is missing

  // Parse the pitch content to HTML
  const parsedContent = md.render(pitchContent);

  return (
    <>
      <section className='pink_container !min-h-10'>
        <p className='tag'>{formatDate(post._createdAt)}</p>
        <h1 className='heading'>{title}</h1>
        <p className='sub-heading !text-black'>{description}</p>
      </section>

      <section className='section_container'>
        <div className=''>
          <div className="section_container">
            <div className="relative">
              {/* Image Section */}
              <img
                src={post.image}
                alt="thumbnail"
                className="w-full md:w-[440px] h-auto rounded-xl float-none md:float-left md:mr-6 mb-3"
              />

              {/* Text Section */}
              <div>
                {parsedContent ? (
                  <article
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                    className="prose max-w-none font-work-sans mb-5"
                  />
                ) : (
                  <p className="no-result">No details provided</p>
                )}
              </div>
            </div>
          </div>

          <div className='flex-between gap-5'>
            <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
              <Image
                src={post.author?.image}
                alt='avatar'
                height={64}
                width={64}
                className='rounded-full drop-shadow-lg'
              />

              <div>
                <p className='text-20-medium'>{post.author?.name}</p>
                <p className='text-20-medium'>@{post.author?.username}</p>
              </div>
            </Link>

            <Link href={`/?query=${category.toLowerCase()}`}>
              <p className='category-tag'>{category}</p>
            </Link>
          </div>
        </div>

        <hr className='divider' />
      </section>
    </>
  );
};

export default page;