// app/[locale]/blogPage/page.tsx
import { BLOG_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import BlogCard, { BlogTypeCard } from '@/components/BlogCard';
import Link from 'next/link';

const POSTS_PER_PAGE = 6;

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const query = resolvedSearchParams.query || null;

  const start = (currentPage - 1) * POSTS_PER_PAGE;

  const paginatedQuery = `
    ${BLOG_QUERY}
    [${start}...${start + POSTS_PER_PAGE}]
  `;

  const params = { search: query };

  const posts: BlogTypeCard[] = await client.fetch(paginatedQuery, params);

  const totalPosts: number = await client.fetch(`count(${BLOG_QUERY})`, params);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <section className='mt-[90px] md:mt-[140px]'>
        <section className="section_container">
          <h1 className="text-30-semibold mb-5">
            {query ? `Search results for "${query}"` : 'Blog Posts'} - Page {currentPage}
          </h1>

          <ul className="mt-7 card_grid">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </ul>

          <nav className="flex justify-center mt-10 space-x-4">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}${query ? `&query=${query}` : ''}`}
                className="startup-card_btn_primary px-4 py-2 border rounded"
              >
                Previous
              </Link>
            )}

            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}${query ? `&query=${query}` : ''}`}
                className="startup-card_btn_primary px-4 py-2 border rounded"
              >
                Next
              </Link>
            )}
          </nav>

          <div className="text-white flex justify-center mt-4">
            Page {currentPage} of {totalPages}
          </div>
        </section>
      </section>
    </>
  );
}
