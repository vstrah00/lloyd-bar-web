import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { BLOG_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import markdownit from 'markdown-it'
 
const page = async ({params}: {params: Promise<{id:string}>}) => {
  const id =((await params).id);
  const md = markdownit();
  const post = (await client.fetch(BLOG_BY_ID_QUERY, {id}));

  if(!post) return notFound();

  const parsedContent = md.render(post?.pitch || '');

  return <>
    <section className='pink_container !min-h-10'>
        <p className='tag'>{formatDate(post._createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
        <p className='sub-heading !text-black'>{post.description}</p>
    </section>
    
    <section className='section_container !pt-0'>
        <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
            
            
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
                    <Image src={post.author?.image} alt='avatar' height={64} width={64} className='rounded-full drop-shadow-lg'/>

                    <div>
                        <p className='text-20-medium'>{post.author.name}</p>
                        <p className='text-20-medium'>@{post.author.username}</p>
                    </div>
                </Link>

                <Link href={`/?query=${post.category?.toLowerCase()}`}>
                    <p className='category-tag'>{post.category}</p>
                </Link>
            </div>               
            
        </div>

        <hr className='divider'/>
    </section>


  </>
}

export default page